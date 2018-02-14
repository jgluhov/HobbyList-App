/**
 * HobbyList | HobbyForm Spec
 */
import * as Components from '@components';
import * as Models from '@models';
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

    describe('#_hiddenBtn()', () => {
        beforeEach(() => {
            hobbyForm.$btn.removeAttribute('hidden');
        });

        describe('when we call it with true param', () => {
            it('should hide btn', () => {
                hobbyForm._hiddenBtn(true);
                expect(hobbyForm.$btn.hasAttribute('hidden')).toBeTruthy();
            });
        });

        describe('when we call it with false param', () => {
            it('should show btn', () => {
                hobbyForm._hiddenBtn(false);
                expect(hobbyForm.$btn.hasAttribute('hidden')).toBeFalsy();
            });
        });
    });

    describe('#_createHobby()', () => {
        let eventSpy: sinon.SinonSpy;
        beforeEach(() => {
            eventSpy = sandbox.spy();
            document.addEventListener('hobby:create', eventSpy);
        });

        describe('when we pass empty string', () => {
            it('should not dispatch an event', () => {
                hobbyForm._createHobby('');
                expect(eventSpy.called).toBeFalsy();
            });
        });
    });

    describe('#_handleDocumentClick()', () => {
        beforeEach(() => {
            hobbyForm.$btn.removeAttribute('hidden');
        });

        describe('when input field is empty', () => {
            it('should hide btn', () => {
                hobbyForm.$input.value = '';

                hobbyForm._handleDocumentClick(new MouseEvent('click'));

                expect(hobbyForm.$btn.hasAttribute('hidden')).toBeTruthy();
            });
        });

        describe('when input field is not empty', () => {
            it('should not hide btn', () => {
                hobbyForm.$input.value = 'some';

                hobbyForm._handleDocumentClick(new MouseEvent('click'));

                expect(hobbyForm.$btn.hasAttribute('hidden')).toBeFalsy();
            });
        });
    });

    describe('#_handleSubmit()', () => {
        let createHobbySpy: sinon.SinonSpy;
        let hiddenBtnSpy: sinon.SinonSpy;

        beforeEach(() => {
            createHobbySpy = sandbox.spy(hobbyForm, '_createHobby');
            hiddenBtnSpy = sandbox.spy(hobbyForm, '_hiddenBtn');
        });

        describe('when input has incorrect text', () => {
            it('should not call createHobby method', () => {
                hobbyForm.$input.value = '123';

                hobbyForm._handleSubmit(new MouseEvent('click'));

                expect(createHobbySpy.called).toBeFalsy();
            });
        });

        describe('when input has correct text', () => {
            it('should call createHobby method', () => {
                hobbyForm.$input.value = 'some';

                hobbyForm._handleSubmit(new MouseEvent('click'));

                expect(createHobbySpy.called).toBeTruthy();
            });

            it('should call createHobby method with value as a param', () => {
                hobbyForm.$input.value = 'some';

                hobbyForm._handleSubmit(new MouseEvent('click'));

                expect(createHobbySpy.calledWith('some')).toBeTruthy();
            });

            it('should clear input value after', () => {
                hobbyForm.$input.value = 'some';

                hobbyForm._handleSubmit(new MouseEvent('click'));

                expect(hobbyForm.$input.value).toBe('');
            });

            it('should hide btn', () => {
                hobbyForm.$input.value = 'some';

                hobbyForm._handleSubmit(new MouseEvent('click'));

                expect(hobbyForm.$btn.hasAttribute('hidden')).toBeTruthy();
            });
        });
    });
});
