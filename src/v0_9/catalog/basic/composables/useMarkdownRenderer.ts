import {inject, provide, type InjectionKey} from 'vue';
import type {MarkdownRenderer} from '@a2ui/web_core/types/types';

export const MarkdownRendererKey: InjectionKey<MarkdownRenderer> = Symbol('MarkdownRenderer');

export function provideMarkdownRenderer(renderer: MarkdownRenderer) {
  provide(MarkdownRendererKey, renderer);
}

export function useMarkdownRenderer(): MarkdownRenderer | undefined {
  return inject(MarkdownRendererKey, undefined);
}
