<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { label?: string; options?: Array<{label: string; value: string}>; value?: string; setValue?: (v: string) => void };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <div class="cp-host">
    <label v-if="p.props.label" class="cp-label">{{ p.props.label }}</label>
    <div class="cp-options">
      <label v-for="opt in (p.props.options || [])" :key="opt.value" class="cp-option">
        <input type="radio" :value="opt.value" :checked="p.props.value === opt.value" @change="p.props.setValue?.(opt.value)" />
        <span>{{ opt.label }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.cp-host { display: flex; flex-direction: column; gap: 8px; }
.cp-label { font-size: 12px; font-weight: 700; color: var(--a2ui-color-muted, #6f7587); }
.cp-options { display: flex; flex-wrap: wrap; gap: 8px; }
.cp-option {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 12px;
  border: 1px solid var(--a2ui-color-border, #d1d5db);
  border-radius: 10px;
  background: rgba(255,255,255,0.72);
  cursor: pointer;
  font-size: 13px;
  font-weight: 680;
  color: #3a4054;
  transition: transform 0.12s, background 0.12s, border-color 0.12s, box-shadow 0.12s;
  user-select: none;
}
.cp-option:hover {
  border-color: var(--a2ui-color-border-strong, #c5cad6);
  transform: translateY(-1px);
}
.cp-option:has(input:checked) {
  background: var(--a2ui-button-primary-background, #111827);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(91, 57, 222, 0.2);
}
.cp-option input[type="radio"] { display: none; }
</style>
