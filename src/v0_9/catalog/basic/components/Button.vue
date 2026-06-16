<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { child?: string; variant?: string; isValid?: boolean; action?: () => void };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const classes = () => {
  const c = ['a2ui-button'];
  if (p.props.variant === 'primary') c.push('a2ui-button--primary');
  if (p.props.variant === 'borderless') c.push('a2ui-button--borderless');
  return c;
};
</script>

<template>
  <button :class="classes()" @click="p.props.action" :disabled="p.props.isValid === false">
    <component :is="p.props.child ? p.buildChild(p.props.child) : null" />
  </button>
</template>

<style scoped>
.a2ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--a2ui-button-padding, 10px 22px);
  border: 1px solid var(--a2ui-color-border, #d1d5db);
  border-radius: var(--a2ui-button-border-radius, 9999px);
  background: var(--a2ui-button-background, #fff);
  color: var(--a2ui-button-color, #111);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, opacity 0.15s;
  white-space: nowrap;
  line-height: 1.4;
}
.a2ui-button:hover:not(:disabled) {
  background: var(--a2ui-button-hover-background, #f3f4f6);
}
.a2ui-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.a2ui-button--primary {
  background: var(--a2ui-button-primary-background, #111827);
  color: var(--a2ui-button-primary-color, #fff);
  border: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
}
.a2ui-button--primary:hover:not(:disabled) {
  background: var(--a2ui-button-primary-hover-background, #374151);
}
.a2ui-button--borderless {
  background: transparent;
  border: none;
  color: var(--a2ui-color-primary, #1d4ed8);
}
.a2ui-button--borderless:hover:not(:disabled) {
  background: rgba(29, 78, 216, 0.07);
}
</style>
