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
.dti-label { font-size: 12px; font-weight: 700; color: var(--a2ui-color-muted, #6f7587); }
.dti-input {
  padding: 9px 12px;
  border: 1px solid var(--a2ui-color-border, #d1d5db);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  color: var(--a2ui-color-on-surface, #111);
  background: var(--a2ui-color-surface-strong, #fff);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: inset 0 1px 2px rgba(35, 40, 58, 0.05);
}
.dti-input:focus {
  border-color: var(--a2ui-color-primary, #6d4df2);
  box-shadow: 0 0 0 3px var(--a2ui-color-primary-soft, rgba(109,77,242,0.11));
}
</style>
