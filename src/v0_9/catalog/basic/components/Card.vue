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
  backdropFilter: 'var(--a2ui-card-backdrop-filter, blur(18px) saturate(1.22))',
  WebkitBackdropFilter: 'var(--a2ui-card-backdrop-filter, blur(18px) saturate(1.22))',
  overflow: 'hidden',
  position: 'relative' as const,
  transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
}));
</script>

<template>
  <div class="a2ui-card" :style="style">
    <component :is="p.props.child ? p.buildChild(p.props.child) : null" />
  </div>
</template>

<style scoped>
.a2ui-card:hover {
  border-color: var(--a2ui-color-border-strong, rgba(88, 94, 116, 0.28));
  box-shadow: var(--a2ui-card-hover-box-shadow, 0 22px 46px rgba(46, 52, 78, 0.13), 0 4px 12px rgba(46, 52, 78, 0.08), inset 0 1px 0 rgba(255,255,255,0.86)) !important;
  transform: translateY(-1px);
}
</style>
