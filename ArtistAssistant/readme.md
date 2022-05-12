# Artist Assistant

> :warning: No guarantee of accuracy is included with this community tooling. Please verify all results when using, and be sure to understand [assumptions](#assumptions)

Artist assistant helps you track the sales made by an artist's Art Blocks project on the OpenSea marketplace. Following an Art Blocks payment, this script will give an artist details about each sales transaction for their project within the given ethereum mainnet block numbers.

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

An example command to query Project `203` "Scoundrels" between blocks `13960989` and `13995989` would be:
```
yarn start inspect "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270" 203 13960989 13995989 --csv
```
where:
- `"0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270"` is the core Art Blocks contract address
- `203` is the Project ID (or Project Number)
- `13960989` is the ethereum mainnet block to begin searching for sales (inclusive)
- `13995989` is the ethereum mainnet block to end searching for sales (inclusive)
- `--csv` means the script should generate a report in the form of a csv file
## Configuration

There is no configuration to set unless for some reason you need to change the delimiter character used in the CSV report file. By default its value is set to `,` but you can change that by:
1. Copying `.env.example` to `.env`
2. Setting the new separator value. For example: `CSV_SEPARATOR=;`

## Help

To query the script usage run :
- `yarn start --help`

The script only contains one command named `inspect`. To get info about this command run:
- `yarn start inspect --help`

## Inspect command

The inspect command lets you inspect all the sales made on OpenSea for a given project and between the given block number range. Usage example:

- Output to the console a summary of the sales made for the Art Blocks Project ID `999` on core contract `0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270` between the blocks `O` (included) and `10000000` (included):
	- ```
	  yarn start inspect "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270" 999 0 10000000
	  ```
	
- Output to the console a summary of the sales made for the Art Blocks Project ID `203` between the blocks `13960989` (included) and `13995989` (included) and **write the full details of each transaction in a CSV file** (by default the CSV file will be stored in the `/reports` folder with a naming convention of `<project-name>_<startBlock>_<endBlock>.csv`). 

	- **This is most likely the main command you will use** 

	- ```
	  yarn start inspect "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270" 203 13960989 13995989 --csv
	  ```

- Output to the console a summary of the sales made for the Art Blocks Project ID `47` between the blocks `13528416` (included) and `13621405` (excluded) and get the detailed result in a CSV file located at the given path. 
	- **The parent folder must exist**. 
	- **On Windows the `\` must be escaped with another `\`**
	- ```
	  npm start inspect "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270" 47 13528416 13621405 --csv --outputPath=D:\\Documents\\my_project_report.csv
		```

# Assumptions
**IMPORTANT FOR ALL USERS TO BE AWARE OF THESE - CURRENT SET OF ASSUMPTIONS ARE INVALID FOR SOME EDGE-CASE OPENSEA SALES**

*This script's logic is behind the state of Royalties Processor Delivery, and could handle edge-cases better if updated*

Until properly handled, these assumptions may result in incorrect royalty estimates.

- Assumes all artists always have a 5% royalty
- Assumes artist/additional payee split has NOT CHANGED between first block queried and current block when script is ran.
- Assumes only one OpenSea sale (i.e. call to `atomicMatch_`) occurs per transaction (limitation of current subgraph schema)
- Assumes bundled sales ONLY contain Art Blocks flagship or PBAB pieces
  - Royalties collected in bulk-sales are divided by total number of tokens in the sale. Currently, the Art Blocks subgraph only tracks Art Blocks token sales. When a bulk sale contains both Art Blocks token(s) *and* non-Art Blocks tokens, the script divides total royalty by the qty of Art Blocks tokens instead qty of all tokens.
- Assumes royalties are being collected in bulk private sales at or after block `13147635`
  - Spot checks indicate OpenSea is **NOT** collecting royalties on bulk private sales, only single-token private sales
  - TBD if OpenSea decides to change royalty policies in the future

# Dependencies

The scripts in this project depend on Art Blocks public hosted subgraph. This can be found at https://thegraph.com/hosted-service/subgraph/artblocks/art-blocks.
