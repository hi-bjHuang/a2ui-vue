import {type A2uiMessage} from '@a2ui/web_core/v0_9';

const exampleModules = import.meta.glob(
  '../../../a2ui/specification/v0_9/catalogs/basic/examples/*.json',
  {eager: true},
);

export interface ExampleFile {
  key: string;
  data: any;
  catalog: string;
}

export function processExampleModules(modules: Record<string, unknown>): ExampleFile[] {
  return Object.entries(modules)
    .map(([path, data]) => {
      const match = path.match(
        /catalogs\/(?<catalogFolderName>[^/]+)\/examples\/(?<filename>[^/]+)$/,
      );

      if (!match?.groups) {
        throw new Error(`Failed to parse path: ${path}`);
      }

      const {catalogFolderName, filename} = match.groups as {
        catalogFolderName: string;
        filename: string;
      };

      const key = `${catalogFolderName}_${filename.replace('.json', '')}`;
      const catalog = catalogFolderName.charAt(0).toUpperCase() + catalogFolderName.slice(1);

      return {
        key,
        data: (data as {default: unknown}).default ?? data,
        catalog,
      };
    })
    .sort((a, b) => {
      if (a.catalog !== b.catalog) {
        return a.catalog.localeCompare(b.catalog);
      }
      return a.key.localeCompare(b.key);
    });
}

export const exampleFiles: ExampleFile[] = processExampleModules(exampleModules);

export const getMessages = (ex: {messages: A2uiMessage[]} | A2uiMessage[] | undefined) =>
  Array.isArray(ex) ? ex : ex?.messages;
