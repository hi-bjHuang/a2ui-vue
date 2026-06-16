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
    style="width: 100%"
  />
</template>
