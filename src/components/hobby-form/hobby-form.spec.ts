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
    let handleInputClickSpy: sinon.SinonSpy;
    let handleSubmitClickSpy: sinon.SinonSpy;
    let compIndex: number = 0;

    beforeEach(async() => {
        compIndex += 1;
        sandbox = sinon.sandbox.create();

        fixture.set(`<hobby-form-${compIndex}></hobby-form-${compIndex}>`);
        customElements.define(`hobby-form-${compIndex}`, class extends Components.HobbyForm {});
        hobbyForm = <Components.HobbyForm>fixture.el.firstChild;
        await customElements.whenDefined(`hobby-form-${compIndex}`);

        handleInputClickSpy = sandbox.spy(hobbyForm, '_handleInputClick');
        handleSubmitClickSpy = sandbox.spy(hobbyForm, '_handleSubmit');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('@attributes', () => {
        describe('when attr was not defined', () => {
            it('should set belonging to own by default', async() => {
                fixture.set('<hobby-form-undef></hobby-form-undef>');
                customElements.define('hobby-form-undef', class extends Components.HobbyForm {});
                const hobbyFormUndef: Components.HobbyForm = <Components.HobbyForm>fixture.el.firstChild;
                await customElements.whenDefined('hobby-form-undef');

                expect(hobbyFormUndef._state.belonging).toBe(Models.Belonging.OWN);
            });
        });

        describe('when attr was defined', () => {
            it('should set belonging correctly', async() => {
                fixture.set('<hobby-form-def belonging="friend"></hobby-form-def>');
                customElements.define('hobby-form-def', class extends Components.HobbyForm {});
                const hobbyFormDef: Components.HobbyForm = <Components.HobbyForm>fixture.el.firstChild;
                await customElements.whenDefined('hobby-form-def');

                expect(hobbyFormDef._state.belonging).toBe(Models.Belonging.FRIEND);
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
