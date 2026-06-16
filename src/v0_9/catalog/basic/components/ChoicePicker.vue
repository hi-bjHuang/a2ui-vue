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
.cp-label { font-size: 0.875rem; font-weight: 500; color: #374151; }
.cp-options { display: flex; flex-wrap: wrap; gap: 8px; }
.cp-option {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background 0.12s, border-color 0.12s;
  user-select: none;
}
.cp-option:has(input:checked) {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
.cp-option input[type="radio"] { display: none; }
</style>
