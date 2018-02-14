/**
 * HobbyListApp | HobbyList Spec
 */
import * as Components from '@components';
import * as Models from '@models';

describe('HobbyList: Spec', () => {
    describe('@attributes', () => {
        describe('it should look after belonging attr', () => {
            it('should contain attr name', () => {
                expect(Components.HobbyList.observedAttributes)
                    .toContain('belonging');
            });
        });

        describe('it should look after threshold attr', () => {
            it('should contain attr name', () => {
                expect(Components.HobbyList.observedAttributes)
                    .toContain('threshold');
            });
        });

        describe('when attrs were not defined', () => {
            it('should set attrs to default values', async() => {
                fixture.set('<hobby-list-undef></hobby-list-undef>');
                customElements.define('hobby-list-undef', class extends Components.HobbyList {});
                const hobbyListUndef: Components.HobbyList = <Components.HobbyList>fixture.el.firstChild;
                await customElements.whenDefined('hobby-list-undef');

                expect(hobbyListUndef._state.belonging).toBe(Models.Belonging.OWN);
                expect(hobbyListUndef._state.threshold).toBe(4);
            });
        });
    });
});
