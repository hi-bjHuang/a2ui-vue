<script setup lang="ts">
import {computed} from 'vue';
import {useBasicCatalogStyles, getWeightStyle} from '../composables/utils';

const p = defineProps<{
  props: { child?: string; weight?: number };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const style = computed(() => ({
  boxSizing: 'border-box' as const,
  ...getWeightStyle(p.props.weight),
  display: 'block',
  border: 'var(--a2ui-card-border, 1px solid #e5e7eb)',
  borderRadius: 'var(--a2ui-card-border-radius, 14px)',
  padding: 'var(--a2ui-card-padding, 20px)',
  background: 'var(--a2ui-card-background, #fff)',
  color: 'var(--a2ui-color-on-surface, #111)',
  boxShadow: 'var(--a2ui-card-box-shadow, 0 2px 12px rgba(0,0,0,0.08))',
  overflow: 'hidden',
}));
</script>

<template>
  <div :style="style">
    <component :is="p.props.child ? p.buildChild(p.props.child) : null" />
  </div>
</template>
