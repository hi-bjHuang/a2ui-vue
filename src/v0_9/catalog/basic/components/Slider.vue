<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { value?: number; min?: number; max?: number; step?: number; label?: string; setValue?: (v: number) => void };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <div class="slider-host">
    <label v-if="p.props.label" class="slider-label">{{ p.props.label }}</label>
    <input
      type="range"
      :min="p.props.min ?? 0"
      :max="p.props.max ?? 100"
      :step="p.props.step ?? 1"
      :value="p.props.value ?? 0"
      @input="p.props.setValue?.(Number(($event.target as HTMLInputElement).value))"
    />
    <span class="slider-value">{{ p.props.value }}</span>
  </div>
</template>

<style scoped>
.slider-host { display: flex; flex-direction: column; gap: 6px; }
.slider-label { font-size: 0.875rem; font-weight: 500; color: #374151; }
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 9999px;
  background: #e5e7eb;
  outline: none;
  accent-color: #111827;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #111827;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
.slider-value { font-size: 0.875rem; color: #6b7280; text-align: right; }
</style>
