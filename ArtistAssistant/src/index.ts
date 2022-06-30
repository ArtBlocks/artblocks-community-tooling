import 'dotenv/config'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { ProjectReport } from './services/project_service'
import { ReportService } from './services/report_service'
import {
  getOpenSeaSalesProjectBlockRange,
  getCurrentProjectData,
} from './api/subgraph'

const reportService = new ReportService()

const processProject = async (
  contractAddr: string,
  projectNumber: number,
  blockNumberStart: number,
  blockNumberEnd: number,
  writeToCsv,
  csvOutputPath
) => {
  const openSeaSales = await getOpenSeaSalesProjectBlockRange(
    contractAddr,
    projectNumber,
    blockNumberStart,
    blockNumberEnd
  )
  const numSales = Object.keys(openSeaSales).length
  console.log(`[INFO] Found total of ${numSales} sales \n\n`)
  // if no sales, just report to console
  if (!numSales) {
    console.info(
      `[INFO] No sales were made by project ${projectNumber} on contract ` +
        `${contractAddr} between block ${blockNumberStart} and ${blockNumberEnd}`
    )
    console.info('[INFO] No report was generated.')
    return
  }
  // get current royalty data for artist/secondary payee
  const currentProjectData = await getCurrentProjectData(
    contractAddr,
    projectNumber
  )
  // generate project report instance
  const projectReport = new ProjectReport(
    contractAddr,
    projectNumber,
    currentProjectData,
    [blockNumberStart, blockNumberEnd]
  )
  // add OpenSea sales to projectReport
  projectReport.addOpenSeaSales(openSeaSales)
  // export project to console
  reportService.reportToConsole(projectReport)
  // export to csv file
  if (writeToCsv) {
    if (csvOutputPath === undefined) {
      // generate default output path based on query
      csvOutputPath = reportService.generateCsvOutputFilePath(
        currentProjectData.name,
        blockNumberStart,
        blockNumberEnd
      )
    }
    reportService.generateCSV(projectReport, csvOutputPath)
  }
}

const contractAddr = '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'
const projectNumber = 203
const blockNumberStart = 13960989
const blockNumberEnd = 13985989

yargs(hideBin(process.argv))
  .strict()
  .command(
    'inspect <contractAddress> <projectNumber> <startingBlock> <endingBlock> [csv] [outputPath]',
    'Process all Opensea sales after the given block number (included)',
    (yargs) => {
      yargs
        .positional('contractAddress', {
          description:
            'The project to look for, between double quote and case sensitive.',
          type: 'string',
        })
        .positional('projectNumber', {
          description: 'The project number to look for',
          type: 'number',
        })
        .positional('startingBlock', {
          description:
            'The starting block number. Only the sales between the given block numbers [startingBlock; endingBlock] (inclusive) will be processed.',
          type: 'number',
        })
        .positional('endingBlock', {
          description:
            'The ending block number. Only the sales between the given block numbers [startingBlock; endingBlock] (inclusive) will be processed.',
          type: 'number',
        })
        .option('csv', {
          description: 'If present, the output will be written to a CSV file.',
          type: 'boolean',
        })
        .option('outputPath', {
          implies: 'csv',
          description:
            'Specify the file path where the CSV files will be stored. Requires the --csv flag to be set.',
          type: 'string',
        })
    },
    async (argv) => {
      const contractAddr = argv.contractAddress as string
      const projectNumber = argv.projectNumber as number
      const blockNumberStart = argv.startingBlock as number
      const blockNumberEnd = argv.endingBlock as number

      const writeToCsv = argv.csv !== undefined
      let outputPath = argv.outputPath as string | undefined

      // validate inputs
      if (blockNumberStart < 0 || blockNumberEnd < blockNumberStart) {
        console.error(
          `The block range [${blockNumberStart}:${blockNumberEnd}] is not valid`
        )
        return
      }
      // process the query on the project
      await processProject(
        contractAddr,
        projectNumber,
        blockNumberStart,
        blockNumberEnd,
        writeToCsv,
        outputPath
      )
    }
  )
  .strict()
  .demandCommand()
  .help()
  .wrap((2 * yargs.terminalWidth()) / 2).argv
