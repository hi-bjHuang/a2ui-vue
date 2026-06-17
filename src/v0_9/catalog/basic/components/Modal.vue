<script setup lang="ts">
import {ref} from 'vue';
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { trigger?: string; content?: string };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const isOpen = ref(false);

const handleBodyClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest('.a2ui-button')) {
    isOpen.value = false;
  }
};
</script>

<template>
  <div>
    <div style="display: inline-block" @click="isOpen = true">
      <component :is="p.props.trigger ? p.buildChild(p.props.trigger) : null" />
    </div>
    <Teleport to="body">
      <div v-if="isOpen" class="modal-overlay" @click="isOpen = false">
        <div class="modal-content" @click.stop>
          <div class="modal-close-row">
            <button class="modal-close" @click="isOpen = false">&times;</button>
          </div>
          <div class="modal-body" @click="handleBodyClick">
            <component :is="p.props.content ? p.buildChild(p.props.content) : null" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(28, 31, 44, 0.34);
  backdrop-filter: blur(10px) saturate(1.1);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
  padding: 20px;
}
.modal-content {
  background: var(--a2ui-card-background, #fff);
  padding: 18px;
  border: 1px solid var(--a2ui-color-border, #e5e7eb);
  border-radius: var(--a2ui-card-border-radius, 14px);
  max-width: min(560px, 92%);
  max-height: 90vh;
  overflow: auto;
  display: flex; flex-direction: column;
  box-shadow: 0 26px 70px rgba(24, 28, 42, 0.24), inset 0 1px 0 rgba(255,255,255,0.82);
  color: var(--a2ui-color-on-surface, #111);
  backdrop-filter: blur(18px) saturate(1.22);
}
.modal-close-row { display: flex; justify-content: flex-end; margin-bottom: 4px; }
.modal-close {
  border: 1px solid var(--a2ui-color-border, #e5e7eb); background: rgba(255,255,255,0.78);
  width: 30px; height: 30px;
  border-radius: 9px;
  font-size: 18px; line-height: 1;
  cursor: pointer; color: var(--a2ui-color-muted, #374151);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s, transform 0.12s;
}
.modal-close:hover { background: #fff; transform: translateY(-1px); }
.modal-body { flex: 1; }
</style>
