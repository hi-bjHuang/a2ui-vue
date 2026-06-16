import {onMounted} from 'vue';
import {injectBasicCatalogStyles} from '@a2ui/web_core/v0_9/basic_catalog';

export function useBasicCatalogStyles() {
  onMounted(() => {
    if (typeof document !== 'undefined' && document.adoptedStyleSheets) {
      injectBasicCatalogStyles();
    }
  });
}

export const mapJustify = (j?: string): string => {
  switch (j) {
    case 'center': return 'center';
    case 'end': return 'flex-end';
    case 'spaceAround': return 'space-around';
    case 'spaceBetween': return 'space-between';
    case 'spaceEvenly': return 'space-evenly';
    case 'start': return 'flex-start';
    case 'stretch': return 'stretch';
    default: return 'flex-start';
  }
};

export const mapAlign = (a?: string): string => {
  switch (a) {
    case 'start': return 'flex-start';
    case 'center': return 'center';
    case 'end': return 'flex-end';
    case 'stretch': return 'stretch';
    default: return 'stretch';
  }
};

export const getWeightStyle = (weight?: number): Record<string, string> => {
  if (typeof weight !== 'number') return {};
  return {flex: `${weight}`, minWidth: '0', minHeight: '0'};
};
