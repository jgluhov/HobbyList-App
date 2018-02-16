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
                    .toContain('max');
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

            it('shoud set max to threshold value by default ', () => {
                expect(hobbyListUndef._state.max).toBe(4);
            });

            it('shoud set threshold equal to max', () => {
                expect(hobbyListUndef._state.threshold).toBe(hobbyListUndef._state.max);
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
                hobbyList.$listFooter.textContent = 'some text';
                hobbyList._state.threshold = 4;
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

        describe('when total items is less then threshold', () => {
            beforeEach(() => {
                hobbyList.$listFooter.removeAttribute('hidden');
                hobbyList.$listFooter.textContent = 'some text';
                
                hobbyList._state.threshold = 4;
                hobbyList._state.total = 3;
                hobbyList._renderFooter();
            });

            it('should set clear the footers text content', () => {
                expect(hobbyList.$listFooter.textContent).toBe('');
            });

            it('should add hidden attribute to the footer', () => {
                expect(hobbyList.$listFooter.hasAttribute('hidden')).toBeTruthy();
            });
        });

        describe('when total items is equal to threshold', () => {
            beforeEach(() => {
                hobbyList.$listFooter.removeAttribute('hidden');
                hobbyList.$listFooter.textContent = 'some text';
                
                hobbyList._state.threshold = 4;
                hobbyList._state.total = 4;
                hobbyList._renderFooter();
            });

            it('should set clear the footers text content', () => {
                expect(hobbyList.$listFooter.textContent).toBe('');
            });

            it('should add hidden attribute to the footer', () => {
                expect(hobbyList.$listFooter.hasAttribute('hidden')).toBeTruthy();
            });
        });

        describe('when total is more then threshold', () => {
            beforeEach(() => {
                hobbyList.$listFooter.setAttribute('hidden', '');
                hobbyList.$listFooter.textContent = 'some text';

                hobbyList._state.max = 4;
            });

            describe('when total is more then threshold', () => {
                beforeEach(() => {
                    hobbyList._state.threshold = 8;
                    hobbyList._state.total = 10;
                    
                    hobbyList._renderFooter();
                });

                it('should set footer text correctly', () => {
                    expect(hobbyList.$listFooter.textContent).toBe('Еще 2 увлечений(я)')
                });

                it('should remove hidden attribute', () => {
                    expect(hobbyList.$listFooter.hasAttribute('hidden')).toBeFalsy();
                });
            });

            describe('when total is equal to threshold', () => {
                beforeEach(() => {
                    hobbyList._state.threshold = 10;
                    hobbyList._state.total = 10;
                    
                    hobbyList._renderFooter();
                });

                it('should set footer text correctly', () => {
                    expect(hobbyList.$listFooter.textContent).toBe('Свернуть')
                });

                it('should remove hidden attribute', () => {
                    expect(hobbyList.$listFooter.hasAttribute('hidden')).toBeFalsy();
                });
            });
        });
    });

    describe('#_insert()', () => {
        describe('when there are no elements in listContent', () => {
            beforeEach(() => {
                hobbyList._insert(0, ownHobby1);
            });

            it('should render list item element', () => {
                expect(hobbyList.$listContent.children.length).toBe(1);
            });

            it('should increase renderingIndex', () => {
                expect(hobbyList._state.renderingIndex).toBe(1);
            });
        });

        describe('when there are elements in listContent', () => {
            let renderedElems: DocumentFragment;
            let insertedEl: HTMLLIElement;
            beforeEach(() => {
                hobbyList._state.renderingIndex = 0;
                renderedElems = hobbyList.service.toElements([
                    ownHobby1, ownHobby2
                ]);
                insertedEl = <HTMLLIElement>hobbyList.service
                    .toElements([ ownHobby3 ]).firstElementChild;

                hobbyList.$listContent.appendChild(renderedElems);

                hobbyList._insert(1, ownHobby3);
            });

            it('should insert element at correct place', () => {
                const li: HTMLLIElement = <HTMLLIElement>hobbyList
                    .$listContent.children.item(1);

                expect(li.isEqualNode(insertedEl)).toBeTruthy()
            });

            it('should increase renderingIndex', () => {
                expect(hobbyList._state.renderingIndex).toBe(1);
            });
        });
    });

    describe('#_renderContent', () => {
        beforeEach(() => {
            hobbyList._state.threshold = 4;
            hobbyList._state.max = 4;
        });

        describe('Inserting...', () => {
            describe('when there are no hobbies in store', () => {
                beforeEach(() => {
                    hobbyList._state.items = [];
                    hobbyList._state.total = 0;
                    hobbyList._state.renderingIndex = 0;
    
                    hobbyList._renderContent();
                });

                it('should not change renderingIndex', () => {
                    expect(hobbyList._state.renderingIndex).toBe(0);
                });
    
                it('should not change list content', () => {
                    expect(hobbyList.$listContent.children.length).toBe(0);
                });
            });

            describe('when there are less hobbies then max', () => {
                beforeEach(() => {
                    hobbyList._state.items = [
                        ownHobby1,
                        ownHobby2,
                        ownHobby3
                    ];
                    hobbyList._state.renderingIndex = 0;
                    hobbyList._renderContent();
                });

                it('should not change renderingIndex', () => {
                    expect(hobbyList._state.renderingIndex).toBe(3);
                });
    
                it('should not change list content', () => {
                    expect(hobbyList.$listContent.children.length).toBe(3);
                });
            });
        })
    });
});
