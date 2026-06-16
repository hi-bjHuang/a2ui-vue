<script setup lang="ts">
import {computed} from 'vue';
import {useBasicCatalogStyles, mapJustify, mapAlign, getWeightStyle} from '../composables/utils';

const p = defineProps<{
  props: { children?: unknown[]; justify?: string; align?: string; weight?: number };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const style = computed(() => ({
  ...getWeightStyle(p.props.weight),
  display: 'flex',
  flexDirection: 'row' as const,
  justifyContent: mapJustify(p.props.justify),
  alignItems: mapAlign(p.props.align),
  gap: 'var(--a2ui-row-gap, var(--a2ui-spacing-m))',
}));
</script>

<template>
  <div :style="style">
    <template v-if="Array.isArray(p.props.children)">
      <template v-for="(child, i) in p.props.children" :key="i">
        <component :is="typeof child === 'string' ? p.buildChild(child) : p.buildChild((child as any).id, (child as any).basePath)" />
      </template>
    </template>
  </div>
</template>
