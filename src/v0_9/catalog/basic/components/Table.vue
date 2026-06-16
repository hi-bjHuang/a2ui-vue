<script setup lang="ts">
import {computed} from 'vue';
import {useBasicCatalogStyles, getWeightStyle} from '../composables/utils';

const p = defineProps<{
  props: {
    columns: {key: string; label: string; width?: string}[];
    rows: unknown;
    striped?: boolean;
    bordered?: boolean;
    weight?: number;
  };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const rows = computed(() => {
  const r = p.props.rows;
  return Array.isArray(r) ? r : [];
});

const bordered = computed(() => p.props.bordered !== false);
const striped = computed(() => p.props.striped === true);

const tableStyle = computed(() => ({
  width: '100%',
  borderCollapse: 'separate' as const,
  borderSpacing: '0',
  fontSize: 'var(--a2ui-font-size-body, 14px)',
  borderRadius: '12px',
  overflow: 'hidden',
  ...getWeightStyle(p.props.weight),
}));

const thStyle = (col: {width?: string}) => ({
  padding: '11px 14px',
  textAlign: 'left' as const,
  fontWeight: 740,
  fontSize: '12px',
  letterSpacing: '0',
  color: 'var(--a2ui-color-muted, #6f7587)',
  background: 'rgba(246, 247, 251, 0.88)',
  borderBottom: '1px solid var(--a2ui-color-border, #e5e7eb)',
  ...(bordered.value ? {borderRight: '1px solid var(--a2ui-color-border, #e5e7eb)'} : {}),
  ...(col.width ? {width: col.width} : {}),
  whiteSpace: 'nowrap' as const,
});

const tdStyle = (rowIndex: number) => ({
  padding: '11px 14px',
  verticalAlign: 'top' as const,
  fontSize: '14px',
  color: 'var(--a2ui-color-on-surface, #111)',
  background: striped.value && rowIndex % 2 === 1 ? 'rgba(248, 249, 253, 0.62)' : 'rgba(255, 255, 255, 0.58)',
  ...(bordered.value
    ? {
        borderRight: '1px solid var(--a2ui-color-border, #e5e7eb)',
        borderBottom: '1px solid var(--a2ui-color-border, #e5e7eb)',
      }
    : {borderBottom: '1px solid rgba(229,231,235,0.72)'}),
});

const cellValue = (row: unknown, key: string): string => {
  if (row && typeof row === 'object') {
    const v = (row as Record<string, unknown>)[key];
    return v == null ? '' : String(v);
  }
  return '';
};
</script>

<template>
  <div class="table-shell">
    <table :style="tableStyle">
      <thead>
        <tr>
          <th v-for="col in p.props.columns" :key="col.key" :style="thStyle(col)">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td
            :colspan="p.props.columns.length"
            class="table-empty"
          >No data</td>
        </tr>
        <tr v-for="(row, i) in rows" :key="i">
          <td v-for="col in p.props.columns" :key="col.key" :style="tdStyle(i)">
            {{ cellValue(row, col.key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-shell {
  overflow-x: auto;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--a2ui-color-border, #e5e7eb);
  background: rgba(255,255,255,0.58);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);
}

.table-empty {
  text-align: center;
  padding: 24px 16px;
  color: var(--a2ui-color-subtle, #9399aa);
  font-size: 14px;
  font-weight: 650;
}
</style>
