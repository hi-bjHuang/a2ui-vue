<script setup lang="ts">
import {shallowRef, watch, onUnmounted, h, computed} from 'vue';
import {ComponentContext, GenericBinder} from '@a2ui/web_core/v0_9';
import type {SurfaceModel, ComponentModel} from '@a2ui/web_core/v0_9';
import type {VueComponentImplementation} from './adapter';
import DeferredChild from './DeferredChild.vue';

const props = defineProps<{
  surface: SurfaceModel<VueComponentImplementation>;
  id: string;
  basePath: string;
  componentModel: ComponentModel;
  compImpl: VueComponentImplementation;
}>();

// Create context
const context = new ComponentContext(props.surface, props.id, props.basePath);

// Create binder to resolve props from data model
const binder = new GenericBinder(context, props.compImpl.schema);
const resolvedProps = shallowRef(binder.snapshot);

const sub = binder.subscribe(() => {
  resolvedProps.value = binder.snapshot;
});

onUnmounted(() => {
  sub.unsubscribe();
  binder.dispose();
});

function buildChild(childId: string, specificPath?: string) {
  const path = specificPath ?? context.dataContext.path;
  return h(DeferredChild, {
    key: `${childId}-${path}`,
    surface: props.surface,
    id: childId,
    basePath: path,
  });
}
</script>

<template>
  <component
    :is="compImpl.component"
    :props="resolvedProps ?? {}"
    :context="context"
    :buildChild="buildChild"
  />
</template>
