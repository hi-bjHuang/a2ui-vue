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
  padding: 4px;
  border: 1px solid var(--a2ui-color-border, #e5e7eb);
  border-radius: 12px;
  margin-bottom: 14px;
  background: rgba(237, 240, 247, 0.72);
  overflow-x: auto;
}
.tab-btn {
  padding: 7px 14px;
  background: transparent;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  color: var(--a2ui-color-muted, #6b7280);
  font-weight: 720;
  white-space: nowrap;
  transition: color 0.12s, background 0.12s, box-shadow 0.12s;
}
.tab-btn:hover { color: var(--a2ui-color-on-surface, #111); }
.tab-btn.active {
  color: var(--a2ui-color-on-surface, #111);
  background: rgba(255,255,255,0.94);
  box-shadow: 0 4px 12px rgba(35, 40, 58, 0.08), inset 0 1px 0 rgba(255,255,255,0.8);
}
.tabs-content { padding: 0; }
</style>
