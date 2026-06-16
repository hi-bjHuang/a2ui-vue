import {ref, watchEffect, type Ref} from 'vue';
import {useMarkdownRenderer} from './useMarkdownRenderer';
import type {MarkdownRendererOptions} from '@a2ui/web_core/types/types';

let warningLogged = false;

export function useMarkdown(text: Ref<string> | string, options?: MarkdownRendererOptions): Ref<string | null> {
  const renderer = useMarkdownRenderer();
  const html = ref<string | null>(null);

  watchEffect(async onCleanup => {
    const t = typeof text === 'string' ? text : text.value;
    if (!renderer) {
      if (!warningLogged) {
        console.warn('[useMarkdown] No markdown renderer configured. Use `@a2ui/markdown-it` or your own.');
        warningLogged = true;
      }
      html.value = null;
      return;
    }
    let active = true;
    onCleanup(() => { active = false; });
    try {
      const result = await renderer(t, options);
      if (active) html.value = result;
    } catch (err) {
      console.error('[useMarkdown] Render failed:', err);
    }
  });

  return html;
}
