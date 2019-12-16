// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
require('../utils/PickTestsToRun')
import './commands'
beforeEach(() => {
    const targetEnv = Cypress.env('testEnv') || Cypress.config('targetEnv')
    cy.log(`Set target environment to: \n ${JSON.stringify(targetEnv)}`)
    cy.log(`Environment details are: \n ${JSON.stringify(Cypress.env(targetEnv))}`)
    cy.log('Now the test starting...')
    Cypress.config('baseUrl', Cypress.env(targetEnv).baseUrl)
  })
// Alternatively you can use CommonJS syntax:
// require('./commands')
