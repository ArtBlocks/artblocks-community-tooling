# Snapshot of Art Blocks Token Holders - The Graph

This python script can be used to generate a snapshot of all addresses that currently hold Art Blocks NFTs. It uses our subgraph to query tokens and their owners.

With the current script configuration, all projects are being queried including AB Collaborations, and this can be updated by changing the contracts added within CORE_CONTRACTS. You can also filter to query just one project by updating PROJECT_ID_FILTER to a project ID, ie. for project "0" (Chromie Squiggles) you would replace "None" with '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a-0'.

See comments in `ArtBlocksTokenHolders.py` for detailed installation instructions and configuration
details.

### Adding an address list to a Merkle/Allowlist Minter Project
1. Query the list of addresses you would like to allow to mint your project. This can be done with `ArtBlocksTokenHolders.py` or by collecting addresses via social channels with a tool like [Premint](https://www.premint.xyz/).
2. Upload your .txt or .csv file containing your allowed addresses to the `Minter` tab of your Art Blocks project shell. This will store the addresses in S3 for quick retrieval and create a merkle-root to be stored on-chain for verification when a holder mints from your project. Note that `ArtBlocksTokenHolders.py` will create a `ArtBlocksTokenHolders_OwnersOnly.csv` file for uploading but you will need to delete the **Owner** header row before saving this to your project shell.

### Other Query Examples:

- For only the Art Blocks flagship projects, remove `AB_COLLABORATOR_CONTRACT_ADDRESSES` from `CORE_CONTRACTS`.

- To include Art Blocks Engine projects, add a new list of core contract addresses and include this list within `CORE_CONTRACTS`. This would look something like this:

>AB_ENGINE_CONTRACT_ADDRESSES = [
  "\"0x28f2d3805652fb5d359486dffb7d08320d403240\"", # GenArt721CoreV2_PBAB
  "\"0xa319c382a702682129fcbf55d514e61a16f97f9c\"",
  "\"0x010...""
  ]

- To retrieve the most up-to-date list of partner contract addresses, please refer to Art Blocks' [smart contract repo](https://github.com/ArtBlocks/artblocks-contracts/tree/main/contracts/PBAB%2BCollabs) and find each Engine (formerly "PBAB") project’s respective `DEPLOYMENTS.md` file. You can also refer to the subgraph's [config file](https://github.com/ArtBlocks/artblocks-subgraph/blob/main/config/mainnet.json) for a running list of past deployments.
