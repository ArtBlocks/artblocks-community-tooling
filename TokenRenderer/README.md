# Artblocks Token Renderer

This script allows you to render images of artblocks tokens server-side at any resolution / aspect ratio.

# Getting started

## Pre-requisite

1. `Node` installed version >= v17.0.1 (https://nodejs.org/)
2. [`yarn`](https://classic.yarnpkg.com/en/docs/install) package manager

## Install

At the project root run the following commands:

```
yarn install
```

## Basic Usage Overview & Example

This tool should be ran from a command line interface.

An example command to render tokenId 10 at 3600 resolution and 1.5 aspect ratio (preferred aspect ratio of Squiggles) to your Documents directory would be:

```
yarn start generate 10 4 --resolution 3600 --aspectRatio 1.5 --outputPath ~/Documents/test.png
```

where:

-   `10` is the ArtBlocks Token ID
-   `4` is the time, in seconds, to wait before capturing the canvas
-   `--resolution` is the resolution to render the image at
-   `--aspectRatio` is the aspect ratio to render the image at
-   `--outputPath` is the directory the png will be placed at (default is ./[tokenId].png)

## Configuration

There is no configuration

## Help

To query the script usage run :

-   `yarn start --help`

The script only contains one command named `generate`. To get info about this command run:

-   `yarn start generate --help`

## Examples

-   Render token ID 0, wait for 1 second, resolution = 2400, aspect ratio = 1, output directory = ./0.png
    -   ```
        yarn start generate 0 1
        ```
-   Render token ID 204000540, wait for 200 seconds, at 3600 resolution and 0.70711 aspect ratio to directory ./204000540.png

    -   ```
        yarn start generate 204000540 200 --resolution 3600 --aspectRatio 0.70711
        ```

-   Same function but hide progress bar

    -   ```
        yarn start generate 204000540 200 --resolution 3600 --aspectRatio 0.70711 --noBar
        ```
