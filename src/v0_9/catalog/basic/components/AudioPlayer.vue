<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { url?: string; autoPlay?: boolean; controls?: boolean };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <audio
    :src="p.props.url"
    :autoplay="p.props.autoPlay"
    :controls="p.props.controls !== false"
    class="a2ui-audio"
  />
</template>

<style scoped>
.a2ui-audio {
  width: 100%;
  border-radius: 12px;
  background: rgba(255,255,255,0.84);
  box-shadow: 0 1px 2px rgba(35, 40, 58, 0.08);
}
</style>
