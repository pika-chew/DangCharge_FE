import { defineConfig, defineTransformer } from 'orval'

function keepMethods(methods: string[]) {
  return defineTransformer((schema) => ({
    ...schema,
    paths: Object.fromEntries(
      Object.entries(schema.paths ?? {}).flatMap(([path, item]) => {
        if (!item) return []

        const operations = Object.entries(item).filter(([key]) => methods.includes(key))
        if (operations.length === 0) return []

        return [[path, {
          ...Object.fromEntries(
            Object.entries(item).filter(([key]) =>
              ['parameters', 'summary', 'description', 'servers'].includes(key),
            ),
          ),
          ...Object.fromEntries(operations),
        }]]
      }),
    ),
  }))
}

export default defineConfig({
  query: {
    input: {
      target: './openapi/query.json',
      override: { transformer: keepMethods(['get']) },
    },
    output: {
      target: './src/api/generated/query.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'single',
      override: {
        mutator: { path: './src/api/client/index.ts', name: 'queryRequest' },
        useTypeOverInterfaces: true,
      },
    },
  },
  command: {
    input: {
      target: './openapi/command.json',
      override: { transformer: keepMethods(['post', 'patch', 'delete']) },
    },
    output: {
      target: './src/api/generated/command.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'single',
      override: {
        mutator: { path: './src/api/client/index.ts', name: 'commandRequest' },
        useTypeOverInterfaces: true,
      },
    },
  },
})
