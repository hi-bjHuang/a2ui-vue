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
.tf-label { font-size: 12px; font-weight: 700; color: var(--a2ui-color-muted, #6f7587); }
.tf-input {
  padding: 9px 12px;
  border: 1px solid var(--a2ui-color-border, #d1d5db);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  color: var(--a2ui-color-on-surface, #111);
  background: var(--a2ui-color-surface-strong, #fff);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  resize: vertical;
  box-shadow: inset 0 1px 2px rgba(35, 40, 58, 0.05);
}
.tf-input:focus {
  border-color: var(--a2ui-color-primary, #6d4df2);
  box-shadow: 0 0 0 3px var(--a2ui-color-primary-soft, rgba(109,77,242,0.11));
  background: #fff;
}
.tf-input.tf-invalid { border-color: var(--a2ui-color-danger, #ef476f); }
.tf-input.tf-invalid:focus { box-shadow: 0 0 0 3px rgba(239,71,111,0.14); }
.tf-error { color: var(--a2ui-color-danger, #ef476f); font-size: 12px; font-weight: 650; }
</style>
