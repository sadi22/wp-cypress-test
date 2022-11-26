describe('Admin can login and make sure plugin is activated', () => {
    before(() => {
        cy.login();
    });

    it('Can activate plugin if it is deactivated', () => {
        cy.deactivatePlugin('mint-email');
        cy.activatePlugin('mint-email');
    });
});