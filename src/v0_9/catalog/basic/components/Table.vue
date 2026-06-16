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
  borderCollapse: 'collapse' as const,
  fontSize: 'var(--a2ui-font-size-body, 0.9rem)',
  borderRadius: '10px',
  overflow: 'hidden',
  ...getWeightStyle(p.props.weight),
}));

const thStyle = (col: {width?: string}) => ({
  padding: '10px 14px',
  textAlign: 'left' as const,
  fontWeight: 600,
  fontSize: '0.82rem',
  letterSpacing: '0.03em',
  color: '#6b7280',
  background: '#f9fafb',
  borderBottom: '1px solid #e5e7eb',
  ...(bordered.value ? {border: '1px solid #e5e7eb'} : {}),
  ...(col.width ? {width: col.width} : {}),
  whiteSpace: 'nowrap' as const,
  textTransform: 'uppercase' as const,
});

const tdStyle = (rowIndex: number) => ({
  padding: '10px 14px',
  verticalAlign: 'top' as const,
  fontSize: '0.9rem',
  color: '#111',
  ...(bordered.value ? {border: '1px solid #e5e7eb'} : {borderBottom: '1px solid #f3f4f6'}),
  ...(striped.value && rowIndex % 2 === 1 ? {background: '#f9fafb'} : {}),
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
  <div style="overflow-x: auto; width: 100%; border-radius: 10px; border: 1px solid #e5e7eb;">
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
            style="text-align: center; padding: 24px 16px; color: #9ca3af; font-size: 0.9rem;"
          >无数据</td>
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
