# Snapshot of Art Blocks Token Holders - The Graph

This python script can be used to generate a snapshot of all addresses that currently hold Art Blocks NFTs. It uses our subgraph to query tokens and their owners.

It can be slightly modified to query all projects, or a single project. 

See comments in `ArtBlocksTokenHolders.py` for detailed installation instructions and configuration
details.

>NOTE: As of 02/2022, the Art Blocks public subgraph returns PBAB tokens. Therefore, a query of all projects will include addresses that only hold PBAB tokens.
