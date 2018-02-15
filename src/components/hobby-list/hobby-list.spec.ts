/**
 * HobbyListApp | HobbyList Spec
 */
import * as Components from '@components';
import * as Models from '@models';

describe('HobbyList: Spec', () => {
    let hobbyList: Components.HobbyList;
    let compIndex: number = 0;

    beforeEach(async() => {
        compIndex += 1;
        fixture.set(`<hobby-list-${compIndex} belonging="own"></hobby-list-${compIndex}>`);
        customElements.define(`hobby-list-${compIndex}`, class extends Components.HobbyList {});
        hobbyList = <Components.HobbyList>fixture.el.firstChild;
        await customElements.whenDefined(`hobby-list-${compIndex}`);
    });

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

    describe('#_setLoading()', () => {
        describe('when we pass true param', () => {
            beforeEach(() => {
                hobbyList.$listContent.classList.remove('hobby-list__content--loading');
                hobbyList._setLoading(true);
            });

            it('should set state loading to true', () => {
                expect(hobbyList._state.loading).toBeTruthy();
            });

            it('should add class loading modificator', () => {
                expect(hobbyList.$listContent.classList.contains('hobby-list__content--loading'))
                    .toBeTruthy();
            });
        });

        describe('when we pass true param', () => {
            beforeEach(() => {
                hobbyList.$listContent.classList.add('hobby-list__content--loading');
                hobbyList._setLoading(false);
            });

            it('should set state loading to true', () => {
                expect(hobbyList._state.loading).toBeFalsy();
            });

            it('should remove class loading modificator', () => {
                expect(hobbyList.$listContent.classList.contains('hobby-list__content--loading'))
                    .toBeFalsy();
            });
        });
    });
});
