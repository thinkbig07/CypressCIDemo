function pickIts() {
    if (global.it.itHadSet) return
  
    const include = Cypress.env('i') && Cypress.env('i').split(',')
    const exclude = Cypress.env('e') && Cypress.env('e').split(',')
  
    const originIt = it
  
    global.it = function (...rest) {
      const itDesc = rest[0]
  
      if (include) {
        if (include.findIndex(item => itDesc.indexOf(item) > -1) > -1) {
          originIt(...rest)
        }
      }
  
      if (exclude) {
        if (!(exclude.findIndex(item => itDesc.indexOf(item) > -1) > -1)) {
          originIt(...rest)
        }
      }
  
      if (!exclude && !include) {
        originIt(...rest)
      }
    }
  
    global.it.itHadSet = true
  }
  
  function pickDescribes() {
    if (global.describe.describeHadSet) return
  
    const include = Cypress.env('I') && Cypress.env('I').split(',')
    const exclude = Cypress.env('E') && Cypress.env('E').split(',')
  
    const originDescribe = describe
  
    global.describe = function (...rest) {
      const describeDesc = rest[0]
  
      if (include) {
        if (include.findIndex(item => describeDesc.indexOf(item) > -1) > -1) {
          originDescribe(...rest)
        }
      }
  
      if (exclude) {
        if (!(exclude.findIndex(item => describeDesc.indexOf(item) > -1) > -1)) {
          originDescribe(...rest)
        }
      }
  
      if (!exclude && !include) {
        originDescribe(...rest)
      }
    }
  
    global.describe.describeHadSet = true
  }
  
  pickIts()
  pickDescribes()
  