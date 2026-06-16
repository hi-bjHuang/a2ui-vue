<script setup lang="ts">
import {ref, onUnmounted, computed, defineAsyncComponent, h, shallowRef} from 'vue';
import type {SurfaceModel} from '@a2ui/web_core/v0_9';
import {ComponentContext} from '@a2ui/web_core/v0_9';
import type {VueComponentImplementation} from './adapter';

const props = defineProps<{
  surface: SurfaceModel<VueComponentImplementation>;
  id: string;
  basePath: string;
}>();

const version = ref(0);
const componentModel = shallowRef(props.surface.componentsModel.get(props.id));

const unsub1 = props.surface.componentsModel.onCreated.subscribe(comp => {
  if (comp.id === props.id) {
    componentModel.value = comp;
    version.value++;
  }
});
const unsub2 = props.surface.componentsModel.onDeleted.subscribe(delId => {
  if (delId === props.id) {
    componentModel.value = undefined;
    version.value++;
  }
});
onUnmounted(() => {
  unsub1.unsubscribe();
  unsub2.unsubscribe();
});

const compImpl = computed(() => {
  if (!componentModel.value) return null;
  return props.surface.catalog.components.get(componentModel.value.type) ?? null;
});
</script>

<template>
  <div v-if="!componentModel" style="color: gray; padding: 4px">[Loading {{ id }}...]</div>
  <div v-else-if="!compImpl" style="color: red">Unknown component: {{ componentModel.type }}</div>
  <ResolvedChild
    v-else
    :surface="surface"
    :id="id"
    :basePath="basePath"
    :componentModel="componentModel"
    :compImpl="compImpl"
  />
</template>

<script lang="ts">
import ResolvedChild from './ResolvedChild.vue';
export default { components: { ResolvedChild } };
</script>
