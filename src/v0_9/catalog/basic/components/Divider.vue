<script setup lang="ts">
import {useBasicCatalogStyles} from '../composables/utils';

defineProps<{
  props: object;
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();
</script>

<template>
  <hr class="a2ui-divider" />
</template>

<style scoped>
.a2ui-divider {
  border: none;
  border-top: 1px solid var(--a2ui-color-border, #e5e7eb);
  margin: 12px 0;
}
</style>
