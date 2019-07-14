/// <reference types="Cypress" />

// Run `export HTTP_PROXY=http://127.0.0.1:1087/` in your terminal if you cann't pass this test.
context("Test Network Connections", () => {
  it("bing", () => cy.visit("https://bing.com"))
  it("google", () => cy.visit("https://google.com"))
  it("facebook", () => cy.visit("https://facebook.com"))
})
