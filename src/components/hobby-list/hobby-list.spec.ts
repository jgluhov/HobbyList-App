/**
 * HobbyListApp | HobbyList Spec
 */
import { Belonging, Hobby } from '@models';
import * as Components from '@components';
import * as Models from '@models';

describe('HobbyList: Spec', () => {
    let hobbyList: Components.HobbyList;
    let compIndex: number = 0;
    let ownHobby1: Hobby;
    let ownHobby2: Hobby;
    let ownHobby3: Hobby;
    let ownHobby4: Hobby;
    let ownHobby5: Hobby;
    let ownHobby6: Hobby;
    let friendHobby1: Hobby;
    let friendHobby2: Hobby;

    beforeEach(() => {
        ownHobby1 = new Hobby('own-hobby-1');
        ownHobby2 = new Hobby('own-hobby-2');
        ownHobby3 = new Hobby('own-hobby-3');
        ownHobby4 = new Hobby('own-hobby-4');
        ownHobby5 = new Hobby('own-hobby-5');
        ownHobby6 = new Hobby('own-hobby-6');
        friendHobby1 = new Hobby('friend-hobby-1', Belonging.FRIEND);
        friendHobby2 = new Hobby('friend-hobby-2', Belonging.FRIEND);
    })

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
            let hobbyListUndef: Components.HobbyList;
            beforeEach(async() => {
                fixture.set(`<hobby-list-undef-${compIndex}></hobby-list-undef-${compIndex}>`);
                customElements.define(`hobby-list-undef-${compIndex}`, class extends Components.HobbyList {});
                hobbyListUndef = <Components.HobbyList>fixture.el.firstChild;
                await customElements.whenDefined(`hobby-list-undef-${compIndex}`);
            });

            it('should set belonging to default value', () => {
                expect(hobbyListUndef._state.belonging).toBe(Models.Belonging.OWN);
            });

            it('shoud set threshold to default value', () => {
                expect(hobbyListUndef._state.threshold).toBe(4);
            });

            it('shoud set limit to be equal to threshold default value', () => {
                expect(hobbyListUndef._state.limit).toBe(4);
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

    describe('#_renderFooter()', () => {
        describe('when there are no hobbies in store', () => {
            beforeEach(() => {
                hobbyList.$listFooter.setAttribute('hidden', '');
                hobbyList._state.items = [];
                hobbyList._state.total = 0;
                
                hobbyList._renderFooter();
            });

            it('should set correct text content at footer', () => {
                expect(hobbyList.$listFooter.textContent).toBe('Список пуст');
            });

            it('should not hide footer content', () => {
                expect(hobbyList.$listFooter.hasAttribute('hidden')).toBeFalsy();
            })
        });

        describe('when total items is less then hobby list limit', () => {
            beforeEach(() => {
                hobbyList.$listFooter.setAttribute('hidden', '');
                
                hobbyList._state.threshold = 4;
                hobbyList._state.limit = 4;
                hobbyList._state.items = [
                    ownHobby1,
                    ownHobby2,
                    ownHobby3,
                ];
                hobbyList._state.total = 3;
                hobbyList._renderFooter();
            });

            it('should not render footer', () => {
                expect(hobbyList.$listFooter.textContent).toBe('');
            })
        });
    });
});
