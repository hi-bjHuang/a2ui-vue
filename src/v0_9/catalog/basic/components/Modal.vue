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
          <div class="modal-body">
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
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  max-width: min(560px, 92%);
  max-height: 90vh;
  overflow: auto;
  display: flex; flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  color: #111;
}
.modal-close-row { display: flex; justify-content: flex-end; margin-bottom: 4px; }
.modal-close {
  border: none; background: #f3f4f6;
  width: 28px; height: 28px;
  border-radius: 50%;
  font-size: 1rem; line-height: 1;
  cursor: pointer; color: #374151;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.12s;
}
.modal-close:hover { background: #e5e7eb; }
.modal-body { flex: 1; }
</style>
