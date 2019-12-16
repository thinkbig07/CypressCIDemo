// / <reference types="cypress" />

const cypress = require('cypress')
const fse = require('fs-extra')
const { merge } = require('mochawesome-merge')
const generator = require('mochawesome-report-generator')
var colors = require('colors');
const program = require('commander');
const moment = require('moment')

program
  .requiredOption('-t, --targetEnvironment <string>', 'Specify the running Env', 'staging')
  .requiredOption('-s, --specFile <string>', 'Spec the running file path', 'cypress/integration/*')
  .option('-i, --onlyRunTest <string>', 'Only run the test cases in it().  for example -i smoke, run cases that contains smoke in description', '[smoke]')
  .option('-e, --excludeTest <string>', 'Exclude to run the test cases in it(), for example -e smoke, exclude to run cases that contains smoke in description')
  .option('-I, --onlyRunSuites <string>', 'Only run the test suits in describe(), for example -I smoke, run test suites that contains smoke in description')
  .option('-E, --excludeSuites <string>', 'only run the test suits in describe(), for example -E smoke, exclude to run run test suits that contains smoke in description')
  .allowUnknownOption()
  .parse(process.argv)

var envParams;
var args = program.opts();
envParams = `testEnv=${args.targetEnvironment}`

if (args.onlyRunTest) envParams = envParams.concat(`,i=${args.onlyRunTest}`);
if(args.excludeTest) envParams = envParams.concat(`,e=${args.excludeTest}`);
if(args.onlyRunSuites) envParams = envParams.concat(`,I=${args.onlyRunSuites}`);
if(args.excludeSuites) envParams = envParams.concat(`,E=${args.excludeSuites}`);

function getTimeStamp () {
  let now = new moment().format('YYYY-MM-DD--HH_mm_ss')
  return now
}

const currRunTimestamp = getTimeStamp()

const sourceReport = {
  reportDir: `${'reports/' + 'Test Run - '}${currRunTimestamp}/mochawesome-report`,
}


const finalReport = {
  reportDir: `${'reports/' + 'Test Run - '}${currRunTimestamp}`,
  saveJson: true,
  reportFilename: 'Run-Report',
  reportTitle: 'Run-Report',
  reportPageTitle: 'Run-Report',
}

async function mergeReport() {
  console.log(`The target Environment are set to: ${program.targetEnvironment}`.bold.yellow)
  console.log(`The target TestPath are set to: ${program.specFile}`.bold.yellow)
  console.log(`The running Env are : ${envParams}`.bold.yellow)

  fse.ensureDirSync(sourceReport.reportDir)

  const { totalFailed } = await cypress.run({
    spec: `${args.specFile}`,
    //Cypress run with provided parameters.
    env: envParams,
    browser: 'chrome',
    config: {
      pageLoadTimeout: 10000,
      screenshotsFolder: `${sourceReport.reportDir}/screenshots`,
      video: false,
      videosFolder: `${sourceReport.reportDir}/videos`,
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: sourceReport.reportDir,
      overwrite: false,
      html: true,
      json: true,
    },
  })
  const jsonReport = await merge(sourceReport)
  await generator.create(jsonReport, finalReport)
  process.exit(totalFailed)
}

mergeReport()
