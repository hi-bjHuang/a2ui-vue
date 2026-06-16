<script setup lang="ts">
import {computed} from 'vue';
import {useBasicCatalogStyles, getWeightStyle} from '../composables/utils';
import {useMarkdown} from '../composables/useMarkdown';

const p = defineProps<{
  props: { text?: unknown; variant?: string; weight?: number };
  buildChild: (id: string, basePath?: string) => unknown;
  context: unknown;
}>();
useBasicCatalogStyles();

const handleVariant = (text: string, variant?: string): string => {
  switch (variant) {
    case 'h1': return `# ${text}`;
    case 'h2': return `## ${text}`;
    case 'h3': return `### ${text}`;
    case 'h4': return `#### ${text}`;
    case 'h5': return `##### ${text}`;
    case 'caption': return `*${text}*`;
    default: return text;
  }
};

const rawText = computed(() => typeof p.props.text === 'string' ? p.props.text : String(p.props.text ?? ''));
const markdownText = computed(() => handleVariant(rawText.value, p.props.variant));
const html = useMarkdown(markdownText);
const style = computed(() => ({boxSizing: 'border-box' as const, ...getWeightStyle(p.props.weight)}));
const isCaption = computed(() => p.props.variant === 'caption')
;
</script>

<template>
  <span v-if="isCaption" :style="style" v-html="html ?? markdownText" />
  <div v-else :style="style" v-html="html ?? markdownText" />
</template>
