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
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s, box-shadow 0.15s, opacity 0.15s, border-color 0.15s;
  white-space: nowrap;
  line-height: 1.25;
  min-height: 36px;
  box-shadow: 0 1px 2px rgba(35, 40, 58, 0.06), inset 0 1px 0 rgba(255,255,255,0.85);
}
.a2ui-button :deep(.a2ui-text),
.a2ui-button :deep(.a2ui-caption),
.a2ui-button :deep(.a2ui-text :where(h1, h2, h3, h4, h5, h6, p, strong, b, em, span)) {
  color: inherit;
}
.a2ui-button:hover:not(:disabled) {
  background: var(--a2ui-button-hover-background, #f3f4f6);
  border-color: var(--a2ui-color-border-strong, #c5cad6);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(35, 40, 58, 0.11), inset 0 1px 0 rgba(255,255,255,0.95);
}
.a2ui-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(35, 40, 58, 0.08);
}
.a2ui-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.a2ui-button--primary {
  background: var(--a2ui-button-primary-background, #111827);
  color: var(--a2ui-button-primary-color, #fff) !important;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(91, 57, 222, 0.24), inset 0 1px 0 rgba(255,255,255,0.26);
  text-shadow: 0 1px 1px rgba(18, 12, 55, 0.28);
}
.a2ui-button--primary:hover:not(:disabled) {
  background: var(--a2ui-button-primary-hover-background, #374151);
  border-color: transparent;
  box-shadow: 0 12px 24px rgba(91, 57, 222, 0.3), inset 0 1px 0 rgba(255,255,255,0.26);
}
.a2ui-button--borderless {
  background: transparent;
  border: none;
  color: var(--a2ui-color-primary, #1d4ed8);
  box-shadow: none;
}
.a2ui-button--borderless:hover:not(:disabled) {
  background: var(--a2ui-color-primary-soft, rgba(29, 78, 216, 0.07));
  box-shadow: none;
}
</style>
