/**
 * HobbyList | HobbyForm Spec
 */
import * as Components from '@components';
import * as Models from '@models';
import 'babel-polyfill';
import * as sinon from 'sinon';

describe('HobbyForm: Spec', () => {
    let sandbox: sinon.SinonSandbox;
    let hobbyForm: Components.HobbyForm;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('@attributes', () => {
        describe('when attr was not defined', () => {
            beforeEach(async() => {
                fixture.set('<hobby-form-undef></hobby-form-undef>');
                customElements.define('hobby-form-undef', class extends Components.HobbyForm {});
                hobbyForm = <Components.HobbyForm>fixture.el.firstChild;
                await customElements.whenDefined('hobby-form-undef');
            });

            it('should set belonging to own by default', () => {
                expect(hobbyForm._state.belonging).toBe(Models.Belonging.OWN);
            });
        });

        describe('when attr was defined', () => {
            beforeEach(async() => {
                fixture.set('<hobby-form-def belonging="friend"></hobby-form-def>');
                customElements.define('hobby-form-def', class extends Components.HobbyForm {});
                hobbyForm = <Components.HobbyForm>fixture.el.firstChild;
                await customElements.whenDefined('hobby-form-def');
            });

            it('should set belonging correctly', () => {
                expect(hobbyForm._state.belonging).toBe(Models.Belonging.FRIEND);
            });
        });

        describe('it should look after belonging attr', () => {
            it('should contain attr name', () => {
                expect(Components.HobbyForm.observedAttributes)
                    .toContain('belonging');
            });
        });
    });

    describe('@event handlers', () => {
        let handleInputClickSpy: sinon.SinonSpy;
        let handleSubmitClickSpy: sinon.SinonSpy;

        beforeEach(() => {
            handleInputClickSpy = sandbox.spy(hobbyForm, '_handleInputClick');
            handleSubmitClickSpy = sandbox.spy(hobbyForm, '_handleSubmit');
        });

        describe('when we click on input', () => {
            it('should be called appropriate handler', () => {
                hobbyForm.$input.click();
                expect(handleInputClickSpy.calledOnce).toBeTruthy();
            });

            it('should not be called btn handler', () => {
                hobbyForm.$input.click();
                expect(handleSubmitClickSpy.called).toBeFalsy();
            });
        });

        describe('when we click on button', () => {
            it('should be called appropriate handler', () => {
                hobbyForm.$btn.click();
                expect(handleSubmitClickSpy.calledOnce).toBeTruthy();
            });

            it('should not be called input handler', () => {
                hobbyForm.$btn.click();
                expect(handleInputClickSpy.called).toBeFalsy();
            });
        });
    });
});
