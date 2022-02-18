import ArtBlocks from 'artblocks';
import puppeteer from 'puppeteer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import cliProgress from 'cli-progress';

const generateImage = async (html, waitTime, resolution, aspectRatio, path) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let height = aspectRatio <= 1 ? resolution : resolution / aspectRatio;
    let width = aspectRatio >= 1 ? resolution : resolution * aspectRatio;

    height = height % 1 == 0 ? height : Math.trunc(height) + 1;
    width = width % 1 == 0 ? width : Math.trunc(width);

    await page.setViewport({
        width: width,
        height: height,
        deviceScaleFactor: 1,
    });
    await page.setContent(html);
    await page.waitForTimeout(waitTime);

    await page.screenshot({ path: path });
    await browser.close();
};

const processProject = async (tokenId, waitTime, resolution, aspectRatio, path, showBar) => {
    const response = await artblocks.token_generator(tokenId);

    if (showBar) {
        bar.start(waitTime, 0);
        interval = setInterval(function () {
            bar.increment();
        }, 1000);
    }

    await generateImage(response, waitTime * 1000, resolution, aspectRatio, path ? path : tokenId.toString() + '.png');

    if (showBar) {
        clearInterval(interval);
        bar.stop();
    }
};

const artblocks = new ArtBlocks('thegraph', 'mainnet');
const bar = new cliProgress.SingleBar(
    {
        format: 'RENDERING... ' + '{bar}' + ' ETA: {eta}s',
    },
    cliProgress.Presets.shades_classic
);
let interval;

yargs(hideBin(process.argv))
    .strict()
    .command(
        'generate <tokenId> <waitTime> [resolution] [aspectRatio] [outputPath] [noBar]',
        'Render ArtBlocks token ID',
        (yargs) => {
            yargs
                .positional('tokenId', {
                    description: 'The token id that you wish to generate',
                    type: 'number',
                })
                .positional('waitTime', {
                    description: 'The wait time in seconds to take a snapshot of the canvas',
                    type: 'number',
                })
                .option('resolution', {
                    description: 'The YxY resolution to generate at default is 2400 (what artblocks uses)',
                    type: 'number',
                })
                .option('aspectRatio', {
                    description: 'The aspect ratio to render the token at, it is in the token metadata',
                    type: 'number',
                })
                .option('outputPath', {
                    description: 'Specify the output file of the png, defaults to <tokenId>.png',
                    type: 'string',
                })
                .option('noBar', {
                    description: 'Flag to show loading bar, defaults to true.',
                    type: 'boolean',
                });
        },
        async (argv) => {
            const tokenId = argv.tokenId;
            const waitTime = argv.waitTime;
            const resolution = argv.resolution ? argv.resolution : 2400;
            const aspectRatio = argv.aspectRatio ? argv.aspectRatio : 1;
            const outputPath = argv.outputPath ? argv.outputPath : '';
            const showBar = argv.noBar ? false : true;

            if (waitTime < 0) {
                console.error(`The wait time ${waitTime} is not valid`);
                return;
            }

            await processProject(tokenId, waitTime, resolution, aspectRatio, outputPath, showBar);
        }
    )
    .strict()
    .demandCommand()
    .help()
    .wrap((2 * yargs.terminalWidth) / 4).argv;
