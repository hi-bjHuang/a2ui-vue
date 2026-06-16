<script setup lang="ts">
import {computed} from 'vue';
import {useBasicCatalogStyles, getWeightStyle} from '../composables/utils';

const p = defineProps<{
  props: { url?: string; description?: string; fit?: string; weight?: number; variant?: string };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const mapFit = (fit?: string) => fit === 'scaleDown' ? 'scale-down' : (fit || 'fill');

const style = computed(() => {
  const s: Record<string, string> = {
    boxSizing: 'border-box',
    ...getWeightStyle(p.props.weight),
    objectFit: mapFit(p.props.fit),
    display: 'block',
    borderRadius: 'var(--a2ui-image-border-radius, 10px)',
    maxWidth: '100%',
    boxShadow: 'var(--a2ui-image-box-shadow, 0 1px 2px rgba(31, 35, 53, 0.08))',
  };
  if (p.props.variant === 'icon') { s.width = 'var(--a2ui-image-icon-size, 24px)'; s.height = s.width; }
  else if (p.props.variant === 'avatar') { s.width = 'var(--a2ui-image-avatar-size, 40px)'; s.height = s.width; s.borderRadius = '50%'; }
  else if (p.props.variant === 'smallFeature') { s.maxWidth = 'var(--a2ui-image-small-feature-size, 100px)'; }
  else if (p.props.variant === 'largeFeature') { s.maxHeight = 'var(--a2ui-image-large-feature-size, 400px)'; }
  else if (p.props.variant === 'header') { s.height = 'var(--a2ui-image-header-size, 200px)'; s.objectFit = 'cover'; }
  return s;
});
</script>

<template>
  <img class="a2ui-image" :src="p.props.url" :alt="p.props.description || ''" :style="style" />
</template>

<style scoped>
.a2ui-image {
  background: linear-gradient(135deg, rgba(246, 247, 251, 0.9), rgba(228, 232, 242, 0.72));
}
</style>
