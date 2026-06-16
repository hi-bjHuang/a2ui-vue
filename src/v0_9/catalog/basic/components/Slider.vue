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
.slider-host { display: flex; flex-direction: column; gap: 7px; }
.slider-label { font-size: 12px; font-weight: 700; color: var(--a2ui-color-muted, #6f7587); }
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--a2ui-color-primary, #6d4df2), #d9ddea);
  outline: none;
  accent-color: var(--a2ui-color-primary, #6d4df2);
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 5px solid var(--a2ui-color-primary, #6d4df2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(91, 57, 222, 0.28);
}
.slider-value { font-size: 12px; font-weight: 700; color: var(--a2ui-color-subtle, #9399aa); text-align: right; }
</style>
