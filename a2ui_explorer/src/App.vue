<script setup lang="ts">
import {computed, onUnmounted, ref, shallowRef, watch} from 'vue';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {SurfaceModel} from '@a2ui/web_core/v0_9';
import {
  A2uiSurface,
  basicCatalog,
  provideMarkdownRenderer,
  type VueComponentImplementation,
} from '@hi-bjhuang/a2ui-vue';
import {renderMarkdown} from '@a2ui/markdown-it';
import {exampleFiles, getMessages} from './examples';
import {A2UIClient} from './client';

provideMarkdownRenderer(renderMarkdown);

type GallerySurface = {
  key: string;
  exampleKey: string;
  title: string;
  description: string;
  catalog: string;
  surface: SurfaceModel<VueComponentImplementation>;
};

type ActionLog = {
  time: string;
  source: string;
  action: unknown;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'agent';
  text?: string;
  html?: string;
  surface?: SurfaceModel<VueComponentImplementation>;
};

const mode = ref<'all' | 'focused' | 'chat'>('all');
const selectedExampleKey = ref(exampleFiles[0]?.key ?? '');
const currentMessageIndex = ref(-1);
const focusedSurfaces = shallowRef<SurfaceModel<VueComponentImplementation>[]>([]);
const allSurfaces = shallowRef<GallerySurface[]>([]);
const actionLogs = ref<ActionLog[]>([]);
const processor = shallowRef<MessageProcessor<VueComponentImplementation> | null>(null);
const chatProcessor = shallowRef<MessageProcessor<VueComponentImplementation> | null>(null);
const chatMessages = ref<ChatMessage[]>([]);
const chatInput = ref('');
const chatServerUrl = ref('http://localhost:10002');
const chatLoading = ref(false);
const chatClient = shallowRef(new A2UIClient(chatServerUrl.value));
const chatSurfaceMsgMap = new Map<string, string>();

const selectedExample = computed(() => {
  return exampleFiles.find(example => example.key === selectedExampleKey.value) ?? exampleFiles[0];
});

const selectedMessages = computed(() => getMessages(selectedExample.value?.data) ?? []);

const selectedDataModel = computed(() => {
  const surface = focusedSurfaces.value[0];
  if (!surface) return 'No surface loaded';
  return JSON.stringify(surface.dataModel.get('/'), null, 2);
});

const activeMessageCount = computed(() => currentMessageIndex.value + 1);

const topbarTitle = computed(() => {
  if (mode.value === 'all') return 'All basic catalog examples';
  if (mode.value === 'chat') return 'Agent chat';
  return selectedExample.value?.data?.name;
});

const topbarCount = computed(() => {
  if (mode.value === 'all') return `${allSurfaces.value.length} rendered`;
  if (mode.value === 'chat') return `${chatMessages.value.length} messages`;
  return `${activeMessageCount.value} rendered`;
});

const createProcessor = (source: string) => {
  return new MessageProcessor<VueComponentImplementation>([basicCatalog], async action => {
    actionLogs.value.unshift({
      time: new Date().toLocaleTimeString(),
      source,
      action,
    });
  });
};

const readSurfaces = (targetProcessor: MessageProcessor<VueComponentImplementation>) => {
  return Array.from(targetProcessor.model.surfacesMap.values());
};

const disposeFocusedProcessor = () => {
  processor.value?.model.dispose();
  processor.value = null;
  focusedSurfaces.value = [];
};

const resetChatClient = () => {
  chatClient.value = new A2UIClient(chatServerUrl.value);
  chatSurfaceMsgMap.clear();
};

const ensureChatProcessor = () => {
  if (chatProcessor.value) return chatProcessor.value;

  chatProcessor.value = createProcessor('Chat');
  return chatProcessor.value;
};

const loadAllExamples = () => {
  const rendered: GallerySurface[] = [];

  for (const example of exampleFiles) {
    const localProcessor = createProcessor(example.data?.name ?? example.key);
    const messages = getMessages(example.data) ?? [];
    localProcessor.processMessages(messages);

    for (const surface of readSurfaces(localProcessor)) {
      rendered.push({
        key: `${example.key}-${surface.id}`,
        exampleKey: example.key,
        title: example.data?.name ?? example.key,
        description: example.data?.description ?? '',
        catalog: example.catalog,
        surface,
      });
    }
  }

  allSurfaces.value = rendered;
};

const resetFocused = (advanceToEnd = true) => {
  disposeFocusedProcessor();
  const nextProcessor = createProcessor(selectedExample.value?.data?.name ?? selectedExampleKey.value);
  processor.value = nextProcessor;
  actionLogs.value = [];

  if (advanceToEnd) {
    const messages = selectedMessages.value;
    nextProcessor.processMessages(messages);
    currentMessageIndex.value = messages.length - 1;
  } else {
    currentMessageIndex.value = -1;
  }

  focusedSurfaces.value = readSurfaces(nextProcessor);
};

const advanceToMessage = (index: number) => {
  if (!processor.value || index <= currentMessageIndex.value) return;
  const messagesToProcess = selectedMessages.value.slice(currentMessageIndex.value + 1, index + 1);
  processor.value.processMessages(messagesToProcess);
  currentMessageIndex.value = index;
  focusedSurfaces.value = readSurfaces(processor.value);
};

const showExample = (key: string) => {
  selectedExampleKey.value = key;
  mode.value = 'focused';
};

const getActionLabel = (action: any) => {
  const ctx = action.context ?? {};
  switch (action.name) {
    case 'book_restaurant':
      return `Book ${ctx.restaurantName ?? 'restaurant'}`;
    case 'cancel_booking':
      return `Cancel ${ctx.restaurantName ?? 'booking'}`;
    default:
      return `[${action.name}]`;
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPlainText = (value: string) => escapeHtml(value).replace(/\n/g, '<br>');

const isA2uiMessage = (message: unknown): message is Record<string, any> => {
  if (!message || typeof message !== 'object') return false;
  return ['createSurface', 'updateComponents', 'updateDataModel', 'deleteSurface'].some(key => key in message);
};

const getSurfaceIds = (message: Record<string, any>) => {
  return [
    message.createSurface?.surfaceId,
    message.updateComponents?.surfaceId,
    message.updateDataModel?.surfaceId,
    message.deleteSurface?.surfaceId,
  ].filter((surfaceId): surfaceId is string => typeof surfaceId === 'string' && surfaceId.length > 0);
};

const sendChatMessage = async (
  textOverride?: string,
  labelOverride?: string,
  a2uiPayloadOverride?: Record<string, unknown>,
) => {
  const text = (textOverride ?? chatInput.value).trim();
  if (!text || chatLoading.value) return;

  chatInput.value = '';
  chatLoading.value = true;
  chatMessages.value.push({
    id: crypto.randomUUID(),
    role: 'user',
    text: labelOverride ?? text,
  });
  if (!a2uiPayloadOverride) {
    chatSurfaceMsgMap.clear();
  }

  try {
    const activeProcessor = ensureChatProcessor();
    const parts = a2uiPayloadOverride
      ? await chatClient.value.sendA2ui(a2uiPayloadOverride)
      : await chatClient.value.send(text);
    const textParts: string[] = [];
    const touchedSurfaceIds = new Set<string>();
    let hasUi = false;

    for (const part of parts) {
      if (part.kind === 'text') {
        textParts.push(part.text);
        continue;
      }

      if (part.kind !== 'data' || !part.data) continue;

      const message = part.data;
      if (!isA2uiMessage(message)) {
        textParts.push(JSON.stringify(message, null, 2));
        continue;
      }

      for (const surfaceId of getSurfaceIds(message)) {
        touchedSurfaceIds.add(surfaceId);
        if (message.createSurface?.surfaceId === surfaceId && activeProcessor.model.getSurface(surfaceId)) {
          activeProcessor.model.deleteSurface(surfaceId);
        }
      }

      activeProcessor.processMessages([message]);
      hasUi = true;
    }

    if (hasUi) {
      for (const surfaceId of touchedSurfaceIds) {
        const surface = activeProcessor.model.getSurface(surfaceId);
        if (!surface) continue;

        const existingMessageId = chatSurfaceMsgMap.get(surfaceId);
        const nextMessageId = crypto.randomUUID();
        chatSurfaceMsgMap.set(surfaceId, nextMessageId);

        if (existingMessageId) {
          const existingIndex = chatMessages.value.findIndex(message => message.id === existingMessageId);
          if (existingIndex !== -1) {
            chatMessages.value.splice(existingIndex, 1, {
              id: nextMessageId,
              role: 'agent',
              surface,
            });
            continue;
          }
        }

        chatMessages.value.push({
          id: nextMessageId,
          role: 'agent',
          surface,
        });
      }
    } else if (textParts.length > 0) {
      const rawText = textParts.join('\n');
      chatMessages.value.push({
        id: crypto.randomUUID(),
        role: 'agent',
        text: rawText,
        html: await renderMarkdown(rawText),
      });
    } else {
      chatMessages.value.push({
        id: crypto.randomUUID(),
        role: 'agent',
        text: '(No response)',
      });
    }
  } catch (error: any) {
    chatMessages.value.push({
      id: crypto.randomUUID(),
      role: 'agent',
      text: `Error: ${error?.message ?? error}`,
    });
  } finally {
    chatLoading.value = false;
  }
};

const handleChatAction = async (action: any) => {
  if (action.name === 'open_url' && typeof action.context?.url === 'string') {
    window.open(action.context.url, '_blank', 'noopener,noreferrer');
    chatMessages.value.push({
      id: crypto.randomUUID(),
      role: 'agent',
      text: `Opened: ${action.context.url}`,
    });
    return;
  }

  const actionPayload = {
    version: 'v0.9',
    action,
  };
  await sendChatMessage(JSON.stringify(actionPayload), getActionLabel(action), actionPayload);
};

chatProcessor.value = new MessageProcessor<VueComponentImplementation>([basicCatalog], handleChatAction);

watch(selectedExampleKey, () => resetFocused(true));
watch(chatServerUrl, resetChatClient);

loadAllExamples();
resetFocused(true);

onUnmounted(() => {
  disposeFocusedProcessor();
  chatProcessor.value?.model.dispose();
  for (const entry of allSurfaces.value) {
    entry.surface.dispose();
  }
});
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <p class="eyebrow">A2UI Vue</p>
        <h1>Component Gallery</h1>
      </div>

      <div class="mode-switch" role="tablist" aria-label="View mode">
        <button :class="{active: mode === 'all'}" @click="mode = 'all'">All components</button>
        <button :class="{active: mode === 'focused'}" @click="mode = 'focused'">Focused</button>
        <button :class="{active: mode === 'chat'}" @click="mode = 'chat'">Chat</button>
      </div>

      <div class="example-list">
        <button
          v-for="example in exampleFiles"
          :key="example.key"
          :class="['example-item', {active: selectedExampleKey === example.key}]"
          @click="showExample(example.key)"
        >
          <span class="example-name">{{ example.data?.name ?? example.key }}</span>
          <span class="example-meta">{{ example.catalog }}</span>
        </button>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">Using local a2ui-vue source</p>
          <h2>{{ topbarTitle }}</h2>
        </div>
        <div class="count-pill">
          {{ topbarCount }}
        </div>
      </header>

      <section v-if="mode === 'all'" class="gallery-grid">
        <article v-for="entry in allSurfaces" :key="entry.key" class="preview-card">
          <header class="preview-header">
            <div>
              <h3>{{ entry.title }}</h3>
              <p>{{ entry.description }}</p>
            </div>
            <button class="inspect-btn" @click="showExample(entry.exampleKey)">
              Inspect
            </button>
          </header>
          <div class="surface-frame">
            <A2uiSurface :surface="entry.surface" />
          </div>
        </article>
      </section>

      <section v-else-if="mode === 'focused'" class="focused-layout">
        <div class="focused-preview">
          <div v-if="focusedSurfaces.length === 0" class="empty-state">
            No surface loaded. Advance a message to render the example.
          </div>
          <div v-for="surface in focusedSurfaces" :key="surface.id" class="surface-frame large">
            <A2uiSurface :surface="surface" />
          </div>
        </div>

        <aside class="inspector">
          <section class="inspector-section">
            <div class="inspector-title">
              <h3>Messages</h3>
              <button class="reset-btn" @click="resetFocused(false)">Reset</button>
            </div>
            <div class="message-list">
              <article
                v-for="(message, index) in selectedMessages"
                :key="index"
                :class="['message-card', {active: index <= currentMessageIndex}]"
              >
                <div class="message-head">
                  <strong>Message {{ index + 1 }}</strong>
                  <button
                    v-if="index > currentMessageIndex"
                    class="advance-btn"
                    @click="advanceToMessage(index)"
                  >
                    Advance
                  </button>
                </div>
                <pre>{{ JSON.stringify(message, null, 2) }}</pre>
              </article>
            </div>
          </section>

          <section class="inspector-section">
            <h3>Data model</h3>
            <pre class="data-model">{{ selectedDataModel }}</pre>
          </section>

          <section class="inspector-section">
            <h3>Action logs</h3>
            <div v-if="actionLogs.length === 0" class="muted">No actions yet.</div>
            <article v-for="(log, index) in actionLogs" :key="index" class="log-card">
              <strong>{{ log.time }} · {{ log.source }}</strong>
              <pre>{{ JSON.stringify(log.action, null, 2) }}</pre>
            </article>
          </section>
        </aside>
      </section>

      <section v-else class="chat-layout">
        <header class="chat-config">
          <label>
            Agent URL
            <input
              v-model="chatServerUrl"
              class="server-input"
              placeholder="http://localhost:10002"
              :disabled="chatLoading"
            />
          </label>
        </header>

        <div class="chat-scroll">
          <div v-if="chatMessages.length === 0" class="empty-state">
            Send a message to render agent text or A2UI surfaces here.
          </div>

          <article
            v-for="message in chatMessages"
            :key="message.id"
            :class="['chat-row', message.role]"
          >
            <div class="chat-avatar">{{ message.role === 'user' ? 'You' : 'AI' }}</div>
            <div class="chat-bubble">
              <div
                v-if="message.text"
                class="chat-text"
                v-html="message.html ?? formatPlainText(message.text)"
              />
              <div v-if="message.surface" class="chat-surface">
                <A2uiSurface :surface="message.surface" />
              </div>
            </div>
          </article>

          <article v-if="chatLoading" class="chat-row agent">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble typing">
              <span />
              <span />
              <span />
            </div>
          </article>
        </div>

        <footer class="chat-composer">
          <input
            v-model="chatInput"
            class="chat-input"
            placeholder="Type a message for the agent..."
            :disabled="chatLoading"
            @keydown.enter="sendChatMessage()"
          />
          <button
            class="send-btn"
            :disabled="chatLoading || !chatInput.trim()"
            @click="sendChatMessage()"
          >
            Send
          </button>
        </footer>
      </section>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #eef1f5;
  color: #1e2430;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  height: 100vh;
  min-height: 0;
}

.sidebar {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 16px;
  border-right: 1px solid #d8dde6;
  background: #fbfcfe;
  padding: 20px 14px;
}

.brand-block {
  padding: 0 6px;
}

.eyebrow {
  margin: 0 0 5px;
  color: #657085;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: 22px;
  line-height: 1.18;
}

h2 {
  margin-top: 4px;
  font-size: 24px;
  line-height: 1.2;
}

h3 {
  font-size: 15px;
  line-height: 1.25;
}

.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  border: 1px solid #d9dee8;
  border-radius: 8px;
  background: #eef2f7;
  padding: 4px;
}

.mode-switch button {
  min-height: 34px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #596579;
  font-size: 13px;
  font-weight: 700;
}

.mode-switch button.active {
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 1px 2px rgba(22, 31, 49, 0.12);
}

.example-list {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-right: 2px;
}

.example-item {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  padding: 10px 10px;
  text-align: left;
}

.example-item:hover {
  background: #f1f4f8;
}

.example-item.active {
  border-color: #a7c7ef;
  background: #e8f2ff;
}

.example-name,
.example-meta {
  display: block;
}

.example-name {
  color: #202838;
  font-size: 13px;
  font-weight: 700;
}

.example-meta {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
}

.workspace {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #d8dde6;
  background: rgba(255, 255, 255, 0.9);
  padding: 18px 24px;
}

.count-pill {
  flex: 0 0 auto;
  border: 1px solid #d9dee8;
  border-radius: 999px;
  background: #fff;
  padding: 7px 12px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 24px 28px;
}

.preview-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  background: #ffffff;
  padding: 14px;
  box-shadow: 0 1px 2px rgba(20, 30, 50, 0.05);
}

.preview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.preview-header p {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
  line-height: 1.35;
}

.inspect-btn,
.reset-btn,
.advance-btn {
  border: 1px solid #ccd5e1;
  border-radius: 7px;
  background: #ffffff;
  color: #1f2937;
  font-size: 12px;
  font-weight: 700;
}

.inspect-btn {
  min-height: 30px;
  padding: 0 10px;
}

.reset-btn,
.advance-btn {
  min-height: 28px;
  padding: 0 9px;
}

.surface-frame {
  min-width: 0;
  overflow: auto;
  border: 1px solid #e4e8ef;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(18, 25, 38, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(18, 25, 38, 0.035) 1px, transparent 1px),
    #f8fafc;
  background-size: 20px 20px;
  padding: 18px;
}

.surface-frame.large {
  min-height: 260px;
}

.a2ui-button--primary,
.a2ui-button--primary .a2ui-text,
.a2ui-button--primary .a2ui-caption,
.modal-content .a2ui-button--primary,
.modal-content .a2ui-button--primary .a2ui-text,
.modal-content .a2ui-button--primary .a2ui-caption,
.modal-content .a2ui-button:last-of-type,
.modal-content .a2ui-button:last-of-type .a2ui-text,
.modal-content .a2ui-button:last-of-type .a2ui-caption {
  color: #ffffff !important;
}

.a2ui-button--primary,
.modal-content .a2ui-button:last-of-type {
  text-shadow: 0 1px 1px rgba(18, 12, 55, 0.28);
}

.focused-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 18px;
  min-height: 0;
  overflow: hidden;
  padding: 18px 24px 24px;
}

.chat-layout {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 0;
  overflow: hidden;
}

.chat-config {
  border-bottom: 1px solid #d8dde6;
  background: #ffffff;
  padding: 12px 24px;
}

.chat-config label {
  display: flex;
  max-width: 560px;
  align-items: center;
  gap: 10px;
  color: #4b5563;
  font-size: 13px;
  font-weight: 700;
}

.server-input {
  min-width: 0;
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px 10px;
  color: #1f2937;
  outline: none;
}

.server-input:focus,
.chat-input:focus {
  border-color: #6aa5e8;
  box-shadow: 0 0 0 3px rgba(106, 165, 232, 0.18);
}

.chat-scroll {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 18px 24px;
}

.chat-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 100%;
}

.chat-row.user {
  flex-direction: row-reverse;
}

.chat-avatar {
  display: flex;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #2f6ea8;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
}

.chat-row.user .chat-avatar {
  background: #3c7f58;
}

.chat-bubble {
  max-width: min(760px, calc(100% - 48px));
  min-width: 0;
  border: 1px solid #dce2ea;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px 14px;
  box-shadow: 0 1px 2px rgba(20, 30, 50, 0.05);
}

.chat-row.user .chat-bubble {
  border-color: #2f6ea8;
  background: #2f6ea8;
  color: #ffffff;
}

.chat-text {
  font-size: 14px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.chat-surface {
  min-width: 280px;
  overflow: auto;
}

.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 42px;
}

.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #97a3b6;
  animation: typing-bounce 1.15s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.18s;
}

.typing span:nth-child(3) {
  animation-delay: 0.36s;
}

@keyframes typing-bounce {
  0%,
  70%,
  100% {
    transform: translateY(0);
  }
  35% {
    transform: translateY(-5px);
  }
}

.chat-composer {
  display: flex;
  gap: 10px;
  border-top: 1px solid #d8dde6;
  background: #ffffff;
  padding: 12px 24px;
}

.chat-input {
  min-width: 0;
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px 12px;
  color: #1f2937;
  outline: none;
}

.send-btn {
  min-width: 84px;
  border: 0;
  border-radius: 8px;
  background: #2f6ea8;
  color: #ffffff;
  font-weight: 800;
}

.send-btn:disabled {
  cursor: default;
  opacity: 0.55;
}

.focused-preview {
  min-width: 0;
  overflow-y: auto;
}

.inspector {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.inspector-section {
  border: 1px solid #dce2ea;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px;
}

.inspector-title,
.message-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.message-card,
.log-card {
  border: 1px solid #e1e6ee;
  border-radius: 7px;
  background: #f8fafc;
  padding: 10px;
}

.message-card.active {
  border-color: #89b9ef;
  background: #eef6ff;
}

pre {
  overflow: auto;
  margin: 8px 0 0;
  max-height: 220px;
  border-radius: 6px;
  background: #101828;
  padding: 10px;
  color: #d9e2f1;
  font-family: "Cascadia Mono", Consolas, monospace;
  font-size: 11px;
  line-height: 1.45;
  white-space: pre-wrap;
}

.data-model {
  max-height: 260px;
}

.muted,
.empty-state {
  color: #667085;
  font-size: 13px;
}

.empty-state {
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #fff;
  padding: 24px;
  text-align: center;
}

@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    max-height: 42vh;
    border-right: 0;
    border-bottom: 1px solid #d8dde6;
  }

  .focused-layout {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}
</style>
