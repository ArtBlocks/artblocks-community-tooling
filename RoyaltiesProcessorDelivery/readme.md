# Royalty Processor Delivery

> :warning: No guarantee of accuracy is included with this community tooling. Please verify all results when using, and be sure to understand [assumptions](#assumptions)

This set of scripts helps summarize and track all sales of all Art Blocks tokens on the OpenSea marketplace.

# Getting started

## Pre-requisite

1. `Node` installed version >= v17.0.1 (https://nodejs.org/)
2. [`yarn`](https://classic.yarnpkg.com/en/docs/install) package manager

## Install

At the project root run the following commands:
```
yarn install
````

## Basic Usage Overview & Example

This tool should be ran from a command line interface.

An example command to query all OpenSea royalties for Art Blocks tokens (including PBAB) between blocks `13960989` (inclusive) and `13995989` (exclusive) would be:
```
yarn start range 13960989 13995989 --csv
```
If only AB flagship tokens (i.e. exclude PBAB) are desired:
```
yarn start range 13960989 13995989 --flagship --csv
```
where:
- `--flagship` indicates PBAB tokens should be excluded
- `13995989` is the ethereum mainnet block to end searching for sales (inclusive)
- `--csv` means the script should generate a report in the form of a csv file

If only curated projects are desired:
```
yarn start range 13960989 13995989 --collection curated --csv
```

## Help

To query the script usage run:
- `yarn start --help`

To query a specific command, e.g. `range`, run:
- `yarn start --help range

# Available Commands

## range
`index.ts range <startingBlock> [endingBlock] [collection] [flagship] [csv] [outputPath]`

This command processes and summarizes all OpenSea sales after `startingBlock` (included) and before `endingBlock` (excluded). Additional optional args:
- `--collection`: filter to only "curated" | "factory" | "playground"
- `--flagship`: boolean, exclude PBAB projects
- `--contract`: filter to only a specific core contract. Generally useful when filtering to specific PBAB contract.
- `--csv`: boolean, output results to csv
- `--outputPath`: set if override of default output path is desired
- `--osAPI`: use OpenSea's API instead of the subgraph. This relies on OpenSea to
have tokens in appropriate collections, trusts the data in their database, etc.

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
  - This is not always true, e.g.: https://etherscan.io/tx/0x8e32abbe9d6ebdb9ec4bc79c1ad176a56317f4716203cffe3dbddbb303915f89
  - Recommend a config file to define this by-project in the future, or encourage the use of Royalty Registry
- Assumes artist/additional payee split has NOT CHANGED between first block queried and current block when script is ran.
  - This is relatively unconcerning in most cases. However, clear communication and awareness must be used regarding how splits change over time.

**Underestimates Artist Payments**:
- Assumes only one OpenSea sale (i.e. call to `atomicMatch_`) occurs per transaction
  - This is not true in all cases, especially for arbitrage bots
    - e.g. https://etherscan.io/tx/0x128763e116ec0f0760bd64f7cbb066b67458f35317d5911a9357734463a91c4a
  - The solution to this is to update the subgraph schema to not use `tx_hash` as a primary key for the OpenSeaSale entity
  - Current behavior of subgraph is that only the last sale to occur in a tx is recorded (overwrites all previous sales in tx)

**Overestimates Artist Payments**:
- Assumes bundled sales ONLY contain Art Blocks flagship or PBAB pieces
  - Royalties collected in bulk-sales are divided by total number of tokens in the sale. Our subgraph only tracks Art Blocks tokens. When a bulk sale contains both Art Blocks token(s) *and* non-Art Blocks tokens, the script divides total royalty by the qty of Art Blocks tokens instead qty of all tokens.
  - Typically ~small portion of total sales
  - Solution to this is to either change the behavior of public subgraph's handling of bulk sales, or use a different source for bulk transactions that contain Art Blocks tokens.
    - Different sources could be: parse logs via web3 calls for *every* transaction (significant usage of web3 provider), or trust OpenSea's api and get sale information for every transaction. The subgraph may be able to indicate bulk transacitons, which would reduce queries.
- Assumes royalties are being collected in bulk private sales at or after block `13147635`
  - Spot checks indicate OpenSea is **NOT** collecting royalties on bulk private sales, only single-token private sales
  - TBD if OpenSea decides to change royalty policies in the future

# Dependencies

The scripts in this project depend on Art Blocks public hosted subgraph. This can be found at https://thegraph.com/hosted-service/subgraph/artblocks/art-blocks.
