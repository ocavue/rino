/// <reference types="Cypress" />

context("Base layout", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1234")
  })

  function clickFirstSidebarItem() {
    cy.get(".sidebar-item__link")
      .should("exist")
      .first()
      .click()
  }

  it("Sidebar", () => {
    cy.get(".sidebar").should("exist")
    cy.get(".sidebar__create-button").should("exist")
    cy.get(".sidebar-item").should("exist")
    cy.get(".sidebar-item--active").should("not.exist")
    clickFirstSidebarItem()
    cy.get(".sidebar-item--active").should("exist")
  })

  it("Editor", () => {
    cy.get(".ProseMirror").should("not.exist")
    clickFirstSidebarItem()
    cy.get(".ProseMirror").should("exist")
  })
})
