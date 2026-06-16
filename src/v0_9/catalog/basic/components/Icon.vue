<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { icon?: string; size?: string };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <span class="material-symbols-outlined" :style="{fontSize: p.props.size || '24px', verticalAlign: 'middle'}">{{ p.props.icon }}</span>
</template>
