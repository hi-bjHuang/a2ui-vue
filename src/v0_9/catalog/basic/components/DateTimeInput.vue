<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { label?: string; value?: string; variant?: string; setValue?: (v: string) => void };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <div class="dti-host">
    <label v-if="p.props.label" class="dti-label">{{ p.props.label }}</label>
    <input
      :type="p.props.variant === 'time' ? 'time' : p.props.variant === 'date' ? 'date' : 'datetime-local'"
      class="dti-input"
      :value="p.props.value || ''"
      @input="p.props.setValue?.(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.dti-host { display: flex; flex-direction: column; gap: 6px; }
.dti-label { font-size: 0.875rem; font-weight: 500; color: #374151; }
.dti-input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  color: #111;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.dti-input:focus {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107,114,128,0.12);
}
</style>
