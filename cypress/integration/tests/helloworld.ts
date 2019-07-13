/// <reference types="Cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1234")
  })

  it("HelloWorld", () => {
    cy.get(".ProseMirror").should("not.exist")

    cy.get(".sidebar__item", { timeout: 10000 })
      .first()
      .click()

    cy.get(".ProseMirror").should("exist")
  })
})
