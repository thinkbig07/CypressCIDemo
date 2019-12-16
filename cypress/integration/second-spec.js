/// <reference types="cypress" />
describe('[smoke]第二个用例', () => {
    it('测试 Module API', () => {
      expect(1).not.equal(2)
    })
  })