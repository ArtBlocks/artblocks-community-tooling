# Royalty Processor Delivery

> :warning: No guarantee of accuracy is included with this community tooling. Please verify all results when using, and be sure to understand [assumptions](#assumptions)

This set of scripts helps summarize and track all sales of all Art Blocks tokens on the OpenSea and LooksRare marketplaces.

# Getting started

## Pre-requisite

1. `Node` installed version >= v17.0.1 (https://nodejs.org/)
2. [`yarn`](https://classic.yarnpkg.com/en/docs/install) package manager

## Install

At the project root run the following commands:
```
yarn install
````

You will also need to create a `.env` file at this directory's root populated with an OpenSea API key (see `.env.example` for format). The API key is always required because royalty collection logic for bundle sales on OpenSea's platform depends on each token's OpenSea collection slug, which is defined off-chain and can therefore not be included in the Art Blocks subgraph.

## Basic Usage Overview & Example

This tool should be ran from a command line interface.

An example command to query all OpenSea and LooksRare royalties for Art Blocks tokens (including PBAB) between blocks `13960989` (inclusive) and `13995989` (exclusive) would be:
```
yarn start range 13960989 13995989 --csv
```
If only AB flagship tokens (i.e. exclude PBAB) are desired:
```
yarn start range 13960989 13995989 --flagship --csv
```
where:
- `--flagship` indicates PBAB tokens should be excluded
- `13960989` is the ethereum mainnet block to begin searching for sales (inclusive)
- `13995989` is the ethereum mainnet block to end searching for sales (exclusive)
- `--csv` means the script should generate a report in the form of a csv file

If only curated projects are desired:
```
yarn start range 13960989 13995989 --collection curated --csv
```

## Help

To query the script usage run:
- `yarn start --help`

To query a specific command, e.g. `range`, run:
- `yarn start --help range`

# Available Commands

## range
`index.ts range <startingBlock> [endingBlock] [collection] [flagship] [csv] [outputPath] [osAPI] [pbabInvoice] [exchange]`

This command processes and summarizes all supported exchanges (currently OpenSea and LooksRare) sales after `startingBlock` (included) and before `endingBlock` (excluded). Additional optional args:
- `--collection`: filter to only "curated" | "factory" | "playground"
- `--flagship`: boolean, exclude PBAB projects
- `--contract`: filter to only a specific core contract. Generally useful when filtering to specific PBAB contract.
- `--csv`: boolean, output results to csv
- `--outputPath`: set if override of default output path is desired
- `--osAPI`: gathers sales events from OpenSea's API instead of the subgraph. This relies on OpenSea to have categorized tokens in appropriate collections, collections haven't changed between time of sale and time of query, trusts the data in OpenSea's database, etc. Note that subgraph is still used to enumerate projects on core contract. Also note that project slugs are cached by default, and may be invalidated by deleting the `./slug_cache` directory (clearing cache only required if OpenSea changes a project's collection slug).
  >Note: Using OpenSea API mode only works with `--flagship` or `--contract`. Also `--exchange` must to be set to "OS".
- `--pbabInvoice`: generates a PBAB invoice detailed report, assuming 2.5% royalties to render provider. Must be filtered down to a single contract via `--contract` command.
- `--exchange`: Specify the exchange to process the sales from. Supported exchanges are : "OS_V1" for OpenSea Wyvern V1, "OS_V2" for OpenSea Wyvern V2, "OS" for OpenSea Wyvern V1 and V2 or "LR_V1" for Looksrare.

A common example of a query running this command is:
```
yarn start range 13960989 13995989 --flagship --csv
```

If getting the same data from the OpenSea API (instead of subgraph):
```
yarn start range 13960989 13995989 --flagship --csv --osAPI
```


For limiting to a specific contract, e.g. PBAB partner Doodle Labs, the following example query would be appropriate:
```
yarn start range 13960989 13995989 --contract 0x28f2D3805652FB5d359486dFfb7D08320D403240 --csv
```

# Assumptions
**IMPORTANT FOR ALL USERS TO BE AWARE OF THESE - ASSUMPTIONS ARE INVALID FOR SOME EDGE-CASE OPENSEA SALES**

Until properly handled, these assumptions may result in incorrect payment estimates.

**Artist payments +/-**:
- Assumes all artists always have a 5% royalty and AB always has a 2.5% royalty
  - Recommend a config file to define this by-project in the future, or encourage the use of Royalty Registry
- Assumes artist/additional payee split has NOT CHANGED between first block queried and current block when script is ran.
  - This is relatively unconcerning in most cases. However, clear communication and awareness must be used regarding how splits change over time.

**Underestimates Artist Payments**:

- (when NOT using OpenSea API mode*) Assumes only one OpenSea sale (i.e. call to `atomicMatch_`) occurs per transaction
  - This is not true in all cases, especially for arbitrage bots
    - e.g. https://etherscan.io/tx/0x128763e116ec0f0760bd64f7cbb066b67458f35317d5911a9357734463a91c4a
  - The solution to this is to update the subgraph schema to not use `tx_hash` as a primary key for the OpenSeaSale entity
  - Current behavior of subgraph is that only the last sale to occur in a tx is recorded (overwrites all previous sales in tx)

**Overestimates Artist Payments**:
  - *no known bugs at this time*

>When using OpenSea API mode, there are no known bugs at this time. If you discover a new previously unknown bug when using OpenSea API mode, please file a bug in this project's public GitHub repository: https://github.com/ArtBlocks/artblocks-community-tooling/issues
# Dependencies

The scripts in this project depend on Art Blocks public hosted subgraph. This can be found at https://thegraph.com/hosted-service/subgraph/artblocks/art-blocks.
