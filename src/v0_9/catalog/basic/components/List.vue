<script setup lang="ts">
import {computed} from 'vue';
import {useBasicCatalogStyles, mapAlign, getWeightStyle} from '../composables/utils';

const p = defineProps<{
  props: { children?: unknown[]; direction?: string; align?: string; weight?: number };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const isHorizontal = computed(() => p.props.direction === 'horizontal');
const style = computed(() => ({
  display: 'flex',
  flexDirection: isHorizontal.value ? 'row' as const : 'column' as const,
  alignItems: mapAlign(p.props.align),
  overflowX: isHorizontal.value ? 'auto' as const : 'hidden' as const,
  overflowY: isHorizontal.value ? 'hidden' as const : 'auto' as const,
  gap: 'var(--a2ui-list-gap, var(--a2ui-spacing-s))',
  padding: 'var(--a2ui-list-padding, 0)',
  ...getWeightStyle(p.props.weight),
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
