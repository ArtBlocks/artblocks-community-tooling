module.exports = {
  overwrite: true,
  schema: {
    ['https://api.thegraph.com/subgraphs/name/artblocks/art-blocks']: {},
  },
  documents: ['./src/graphql/*.graphql'],
  generates: {
    './src/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
      config: {
        maybeValue: 'T | null | undefined',
        scalars: {
          BigInt: 'string',
          BigDecimal: 'string',
          Bytes: 'string',
          timestamptz: 'string',
        },
        withHooks: false,
      },
    },
  },
}
