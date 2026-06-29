<script setup lang="ts">
import {computed, shallowRef} from 'vue';
import {useBasicCatalogStyles} from '../composables/utils';

type FileUploadReadMode = 'metadata' | 'dataUrl' | 'text';

type UploadedFileValue = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content?: string;
};

const p = defineProps<{
  props: {
    label?: string;
    description?: string;
    buttonLabel?: string;
    value?: UploadedFileValue[] | UploadedFileValue | null;
    accept?: string[];
    multiple?: boolean;
    disabled?: boolean;
    maxSizeBytes?: number;
    readAs?: FileUploadReadMode;
    validationErrors?: string[];
    setValue?: (v: UploadedFileValue[] | UploadedFileValue | null) => void;
  };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const inputRef = shallowRef<HTMLInputElement | null>(null);
const localError = shallowRef('');

const files = computed(() => {
  const value = p.props.value;
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
});

const hasError = computed(() => !!localError.value || !!p.props.validationErrors?.length);
const errorText = computed(() => localError.value || p.props.validationErrors?.[0] || '');
const acceptValue = computed(() => p.props.accept?.join(',') || undefined);
const helperText = computed(() => {
  if (p.props.description) return p.props.description;
  if (p.props.maxSizeBytes) return `Maximum file size: ${formatBytes(p.props.maxSizeBytes)}`;
  return p.props.multiple ? 'No files selected.' : 'No file selected.';
});

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
};

const readFile = (file: File): Promise<UploadedFileValue> => {
  const base: UploadedFileValue = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  if (!p.props.readAs || p.props.readAs === 'metadata') {
    return Promise.resolve(base);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read file.'));
    reader.onload = () => resolve({...base, content: String(reader.result ?? '')});
    if (p.props.readAs === 'text') reader.readAsText(file);
    else reader.readAsDataURL(file);
  });
};

const updateFiles = async (fileList: FileList | File[]) => {
  localError.value = '';
  const selected = Array.from(fileList);
  const limit = p.props.maxSizeBytes;
  const oversized = typeof limit === 'number' ? selected.find(file => file.size > limit) : undefined;

  if (oversized && limit) {
    localError.value = `${oversized.name} exceeds ${formatBytes(limit)}.`;
    return;
  }

  try {
    const nextFiles = await Promise.all(selected.map(readFile));
    p.props.setValue?.(p.props.multiple ? nextFiles : (nextFiles[0] ?? null));
  } catch (error) {
    localError.value = error instanceof Error ? error.message : 'Unable to read file.';
  }
};

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) void updateFiles(target.files);
  target.value = '';
};

const clearFiles = () => {
  localError.value = '';
  p.props.setValue?.(p.props.multiple ? [] : null);
};
</script>

<template>
  <div class="fu-host">
    <div v-if="p.props.label" class="fu-label">{{ p.props.label }}</div>

    <div class="fu-control">
      <label :class="['fu-button', hasError ? 'fu-button--invalid' : '', p.props.disabled ? 'fu-button--disabled' : '']">
        <input
          ref="inputRef"
          class="fu-input"
          type="file"
          :accept="acceptValue"
          :multiple="p.props.multiple"
          :disabled="p.props.disabled"
          @change="onInputChange"
        />
        <span class="fu-button-icon" aria-hidden="true">+</span>
        <span>{{ p.props.buttonLabel || 'Choose file' }}</span>
      </label>
      <span class="fu-help">{{ files.length ? `${files.length} selected` : helperText }}</span>
    </div>

    <div v-if="files.length" class="fu-files">
      <div v-for="file in files" :key="`${file.name}-${file.lastModified}-${file.size}`" class="fu-file">
        <span class="fu-file-name">{{ file.name }}</span>
        <span class="fu-file-meta">{{ file.type || 'Unknown type' }} / {{ formatBytes(file.size) }}</span>
      </div>
      <button type="button" class="fu-clear" :disabled="p.props.disabled" @click="clearFiles">Clear</button>
    </div>

    <span v-if="hasError" class="fu-error">{{ errorText }}</span>
  </div>
</template>

<style scoped>
.fu-host {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.fu-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--a2ui-color-muted, #6f7587);
}
.fu-control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.fu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: var(--a2ui-button-padding, 8px 16px);
  border: 1px solid var(--a2ui-color-border, #d1d5db);
  border-radius: var(--a2ui-button-border-radius, 9px);
  background: var(--a2ui-button-background, rgba(255,255,255,0.78));
  color: var(--a2ui-button-color, #23283a);
  box-shadow: 0 1px 2px rgba(35, 40, 58, 0.06), inset 0 1px 0 rgba(255,255,255,0.85);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
  transition: transform 0.15s, background 0.15s, border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.fu-button:hover {
  border-color: var(--a2ui-color-border-strong, #c5cad6);
  background: var(--a2ui-button-hover-background, #f3f4f6);
  box-shadow: 0 8px 18px rgba(35, 40, 58, 0.11), inset 0 1px 0 rgba(255,255,255,0.95);
  transform: translateY(-1px);
}
.fu-button--invalid {
  border-color: var(--a2ui-color-danger, #ef476f);
}
.fu-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.fu-button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--a2ui-color-primary-soft, rgba(109,77,242,0.11));
  color: var(--a2ui-color-primary, #6d4df2);
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
}
.fu-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.fu-help {
  min-width: 0;
  color: var(--a2ui-color-subtle, #9399aa);
  font-size: 12px;
  font-weight: 560;
}
.fu-files {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fu-file {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid var(--a2ui-color-border, rgba(126, 133, 155, 0.2));
  border-radius: 10px;
  background: rgba(255,255,255,0.72);
}
.fu-file-name {
  min-width: 0;
  overflow: hidden;
  color: #23283a;
  font-size: 13px;
  font-weight: 680;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fu-file-meta {
  color: var(--a2ui-color-subtle, #9399aa);
  font-size: 12px;
  font-weight: 560;
  white-space: nowrap;
}
.fu-clear {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--a2ui-color-primary, #6d4df2);
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
}
.fu-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.fu-error {
  color: var(--a2ui-color-danger, #ef476f);
  font-size: 12px;
  font-weight: 650;
}
</style>
