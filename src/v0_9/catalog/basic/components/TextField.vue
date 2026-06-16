<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { label?: string; value?: string; variant?: string; validationErrors?: string[]; setValue?: (v: string) => void };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const onChange = (e: Event) => {
  p.props.setValue?.((e.target as HTMLInputElement).value);
};
const isLong = () => p.props.variant === 'longText';
const inputType = () => {
  if (p.props.variant === 'number') return 'number';
  if (p.props.variant === 'obscured') return 'password';
  return 'text';
};
const hasError = () => !!(p.props.validationErrors?.length);
</script>

<template>
  <div class="tf-host">
    <label v-if="p.props.label" class="tf-label">{{ p.props.label }}</label>
    <textarea v-if="isLong()" :class="['tf-input', hasError() ? 'tf-invalid' : '']" :value="p.props.value || ''" @input="onChange" />
    <input v-else :type="inputType()" :class="['tf-input', hasError() ? 'tf-invalid' : '']" :value="p.props.value || ''" @input="onChange" />
    <span v-if="hasError()" class="tf-error">{{ p.props.validationErrors![0] }}</span>
  </div>
</template>

<style scoped>
.tf-host { display: flex; flex-direction: column; gap: 6px; }
.tf-label { font-size: 0.875rem; font-weight: 500; color: #374151; }
.tf-input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  color: #111;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: vertical;
}
.tf-input:focus {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107,114,128,0.12);
}
.tf-input.tf-invalid { border-color: #ef4444; }
.tf-input.tf-invalid:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
.tf-error { color: #ef4444; font-size: 0.78rem; }
</style>
