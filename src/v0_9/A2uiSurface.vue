<script setup lang="ts">
import type {SurfaceModel} from '@a2ui/web_core/v0_9';
import type {VueComponentImplementation} from './adapter';
import DeferredChild from './DeferredChild.vue';

defineProps<{
  surface: SurfaceModel<VueComponentImplementation>;
}>();
</script>

<template>
  <DeferredChild :surface="surface" id="root" basePath="/" />
</template>
