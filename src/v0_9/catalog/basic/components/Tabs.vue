<script setup lang="ts">
import {ref} from 'vue';
import {useBasicCatalogStyles} from '../composables/utils';

const p = defineProps<{
  props: { tabs?: Array<{title: string; child: string}>; weight?: number };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const selectedIndex = ref(0);
</script>

<template>
  <div>
    <div class="tabs-headers">
      <button
        v-for="(tab, i) in (p.props.tabs || [])"
        :key="i"
        :class="['tab-btn', i === selectedIndex ? 'active' : '']"
        @click="selectedIndex = i"
      >{{ tab.title }}</button>
    </div>
    <div class="tabs-content">
      <component
        v-if="p.props.tabs && p.props.tabs[selectedIndex]"
        :is="p.buildChild(p.props.tabs[selectedIndex].child)"
      />
    </div>
  </div>
</template>

<style scoped>
.tabs-headers {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}
.tab-btn {
  padding: 8px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  border-radius: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.12s, border-color 0.12s;
}
.tab-btn:hover { color: #111; }
.tab-btn.active {
  color: #111;
  border-bottom-color: #111827;
}
.tabs-content { padding: 0; }
</style>
