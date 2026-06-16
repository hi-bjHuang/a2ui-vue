<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { checked?: boolean; label?: string; setValue?: (v: boolean) => void };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <label class="cb-host">
    <input type="checkbox" :checked="p.props.checked" @change="p.props.setValue?.(($event.target as HTMLInputElement).checked)" />
    <span v-if="p.props.label" class="cb-label">{{ p.props.label }}</span>
  </label>
</template>

<style scoped>
.cb-host { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
.cb-host input[type="checkbox"] {
  width: 18px; height: 18px;
  border-radius: 6px;
  accent-color: var(--a2ui-color-primary, #6d4df2);
  cursor: pointer;
  flex-shrink: 0;
}
.cb-label { font-family: inherit; font-size: 14px; font-weight: 600; color: #3a4054; }
</style>
