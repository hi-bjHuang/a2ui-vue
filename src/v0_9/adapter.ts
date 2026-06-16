import type {ComponentApi, InferredComponentApiSchemaType, ResolveA2uiProps, ComponentContext} from '@a2ui/web_core/v0_9';
import type {Component} from 'vue';

export interface VueComponentImplementation extends ComponentApi {
  component: Component<{
    context: ComponentContext;
    buildChild: (id: string, basePath?: string) => unknown;
  }>;
}

export type VueA2uiComponentProps<T> = {
  props: T;
  buildChild: (id: string, basePath?: string) => unknown;
  context: ComponentContext;
};

export function createComponentImplementation<Api extends ComponentApi>(
  api: Api,
  component: Component<VueA2uiComponentProps<ResolveA2uiProps<InferredComponentApiSchemaType<Api>>>>,
): VueComponentImplementation {
  return {
    name: api.name,
    schema: api.schema,
    component: component as Component<{
      context: ComponentContext;
      buildChild: (id: string, basePath?: string) => unknown;
    }>,
  };
}
