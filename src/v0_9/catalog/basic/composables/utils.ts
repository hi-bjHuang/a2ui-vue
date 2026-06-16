import {onMounted} from 'vue';
import {injectBasicCatalogStyles} from '@a2ui/web_core/v0_9/basic_catalog';

const STYLE_ID = 'a2ui-vue-basic-theme';

const injectVueBasicTheme = () => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    :root {
      --a2ui-color-surface: rgba(255, 255, 255, 0.78);
      --a2ui-color-surface-strong: rgba(255, 255, 255, 0.96);
      --a2ui-color-on-surface: #171b2a;
      --a2ui-color-muted: #6f7587;
      --a2ui-color-subtle: #9399aa;
      --a2ui-color-border: rgba(126, 133, 155, 0.2);
      --a2ui-color-border-strong: rgba(88, 94, 116, 0.28);
      --a2ui-color-primary: #6d4df2;
      --a2ui-color-primary-strong: #4f35cf;
      --a2ui-color-primary-soft: rgba(109, 77, 242, 0.11);
      --a2ui-color-success: #12b981;
      --a2ui-color-warning: #f29d38;
      --a2ui-color-danger: #ef476f;
      --a2ui-spacing-xs: 4px;
      --a2ui-spacing-s: 8px;
      --a2ui-spacing-m: 12px;
      --a2ui-spacing-l: 16px;
      --a2ui-font-size-body: 14px;
      --a2ui-card-border: 1px solid var(--a2ui-color-border);
      --a2ui-card-border-radius: 14px;
      --a2ui-card-padding: 16px;
      --a2ui-card-background: linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,249,253,0.84));
      --a2ui-card-box-shadow: 0 18px 42px rgba(46, 52, 78, 0.1), 0 2px 8px rgba(46, 52, 78, 0.06), inset 0 1px 0 rgba(255,255,255,0.78);
      --a2ui-row-gap: 12px;
      --a2ui-column-gap: 12px;
      --a2ui-list-gap: 10px;
      --a2ui-button-padding: 8px 16px;
      --a2ui-button-border-radius: 9px;
      --a2ui-button-background: rgba(255,255,255,0.78);
      --a2ui-button-hover-background: #f4f2ff;
      --a2ui-button-color: #23283a;
      --a2ui-button-primary-background: linear-gradient(135deg, #7a4df3, #5b39de);
      --a2ui-button-primary-hover-background: linear-gradient(135deg, #6842df, #4d2ec4);
      --a2ui-button-primary-color: #ffffff;
      --a2ui-image-border-radius: 10px;
      --a2ui-image-avatar-size: 46px;
      --a2ui-image-icon-size: 24px;
      color: var(--a2ui-color-on-surface);
    }

    .a2ui-surface,
    #root {
      font-family: ui-sans-serif, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
      font-size: var(--a2ui-font-size-body);
      line-height: 1.45;
      color: var(--a2ui-color-on-surface);
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }

    .a2ui-text {
      color: var(--a2ui-color-on-surface);
      min-width: 0;
    }

    .a2ui-text :where(h1, h2, h3, h4, h5, p) {
      margin: 0;
    }

    .a2ui-text :where(h1, h2, h3) {
      font-weight: 760;
      letter-spacing: 0;
      line-height: 1.12;
      color: #171b2a;
    }

    .a2ui-text h1 { font-size: 26px; }
    .a2ui-text h2 { font-size: 21px; }
    .a2ui-text h3 { font-size: 17px; }
    .a2ui-text h4,
    .a2ui-text h5 {
      margin: 0;
      font-size: 14px;
      font-weight: 720;
      color: #23283a;
    }

    .a2ui-text p {
      color: #303548;
    }

    .a2ui-text em,
    .a2ui-caption {
      font-size: 12px;
      font-style: normal;
      font-weight: 560;
      color: var(--a2ui-color-subtle);
    }

    .a2ui-text :where(strong, b) {
      font-weight: 760;
      color: #171b2a;
    }

    .a2ui-text :where(a) {
      color: var(--a2ui-color-primary);
      font-weight: 650;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);
};

export function useBasicCatalogStyles() {
  onMounted(() => {
    if (typeof document !== 'undefined' && document.adoptedStyleSheets) {
      injectBasicCatalogStyles();
    }
    injectVueBasicTheme();
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
