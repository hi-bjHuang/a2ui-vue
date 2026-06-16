<script setup lang="ts">
import {useBasicCatalogStyles, getWeightStyle} from '../composables/utils';
import {computed} from 'vue';

const p = defineProps<{
  props: { url?: string; autoPlay?: boolean; controls?: boolean; weight?: number };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
const style = computed(() => ({...getWeightStyle(p.props.weight), display: 'block', width: '100%'}));
</script>

<template>
  <video
    :src="p.props.url"
    :autoplay="p.props.autoPlay"
    :controls="p.props.controls !== false"
    :style="style"
  />
</template>
