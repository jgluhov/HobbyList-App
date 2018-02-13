/**
 * HobbyList | HobbyForm Spec
 */
import * as Components from '@components';
import * as Models from '@models';
import 'babel-polyfill';

describe('HobbyForm: Spec', () => {
    let hobbyForm: Components.HobbyForm;

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
});
