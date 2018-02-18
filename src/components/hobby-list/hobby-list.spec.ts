/**
 * HobbyListApp | HobbyList Spec
 */
import { Belonging, Hobby } from '@models';
import * as Components from '@components';
import * as Models from '@models';
import * as HobbyListConstants from '@components'
import * as sinon from 'sinon';

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
    let sandobox: sinon.SinonSandbox;

    beforeEach(() => {
        sandobox = sinon.createSandbox();

        ownHobby1 = new Hobby('own-hobby-1');
        ownHobby2 = new Hobby('own-hobby-2');
        ownHobby3 = new Hobby('own-hobby-3');
        ownHobby4 = new Hobby('own-hobby-4');
        ownHobby5 = new Hobby('own-hobby-5');
        ownHobby6 = new Hobby('own-hobby-6');
        friendHobby1 = new Hobby('friend-hobby-1', Belonging.FRIEND);
        friendHobby2 = new Hobby('friend-hobby-2', Belonging.FRIEND);
    })

    afterEach(() => {
        sandobox.restore();
    });

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

        describe('it should look after length attr', () => {
            it('should contain attr name', () => {
                expect(Components.HobbyList.observedAttributes)
                    .toContain('length');
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

            it('shoud set length to threshold value by default ', () => {
                expect(hobbyListUndef._state.length).toBe(4);
            });

            it('shoud set threshold equal to length', () => {
                expect(hobbyListUndef._state.threshold).toBe(hobbyListUndef._state.length);
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

                hobbyList._state.length = 4;
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
            let li: HTMLLIElement;
            
            beforeEach(() => {
                hobbyList._state.renderingIndex = 0;
                renderedElems = hobbyList.service.toElements([
                    ownHobby1, ownHobby2
                ]);
                insertedEl = <HTMLLIElement>hobbyList.service
                    .toElements([ ownHobby3 ]).firstElementChild;

                hobbyList.$listContent.appendChild(renderedElems);

                hobbyList._insert(1, ownHobby3);
                li = <HTMLLIElement>hobbyList.$listContent.children.item(1);
            });

            it('should insert element at correct place', () => {
                expect(li.id).toBe(insertedEl.id);
            });

            it('should increase renderingIndex', () => {
                expect(hobbyList._state.renderingIndex).toBe(1);
            });

            it('should add inserted class to element', () => {
                expect(li.classList.contains('hobby-list__item--inserted'));
            });
        });
    });

    describe('#_renderContent', () => {
        beforeEach(() => {
            hobbyList._state.threshold = 4;
            hobbyList._state.length = 4;
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

            describe('when there are less hobbies then length', () => {
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

            describe('when there are more hobbies then length', () => {
                beforeEach(() => {
                    hobbyList._state.items = [
                        ownHobby1, ownHobby2, ownHobby3,
                        ownHobby4, ownHobby5, ownHobby6, 
                        ownHobby1, ownHobby2, ownHobby3,
                        ownHobby4
                    ];
                    hobbyList._state.renderingIndex = 0;
                    hobbyList._renderContent();
                });

                it('should not change renderingIndex', () => {
                    expect(hobbyList._state.renderingIndex).toBe(4);
                });
    
                it('should not change list content', () => {
                    expect(hobbyList.$listContent.children.length).toBe(4);
                });

                describe('when threshold is increased', () => {
                    beforeEach(() => {
                        hobbyList._state.threshold = 8;
                        hobbyList._renderContent();
                    });

                    it('should change renderingIndex to', () => {
                        expect(hobbyList._state.renderingIndex).toBe(8);
                    });
        
                    it('should not change list content', () => {
                        expect(hobbyList.$listContent.children.length).toBe(8);
                    });
                });
            });
        });
    });

    describe('#_handleFooterClick()', () => {
        let event: MouseEvent;
        let loadHobbiesStub: sinon.SinonStub;
        beforeEach(() => {
            event = new MouseEvent('click');
            hobbyList._state.threshold = 4;
            loadHobbiesStub = sinon.stub(hobbyList, '_loadHobbies').returns(() => {
                return new Promise(() => {});
            })
        });

        describe('when there are no items in state', () => {
            beforeEach(() => {
                hobbyList._state.total = 0;
                
                hobbyList._handleFooterClick(event);
            });

            it('should not increase threshold', () => {
                expect(hobbyList._state.threshold).toBe(4);
            });

            it('should not call loadHobbies', () => {
                expect(loadHobbiesStub.called).toBeFalsy();
            });
        });

        describe('when there are less items then length', () => {
            beforeEach(() => {
                hobbyList._state.total = 3;
                
                hobbyList._handleFooterClick(event);
            });

            it('should not increase threshold', () => { 
                expect(hobbyList._state.threshold).toBe(4);
            });

            it('should not call loadHobbies', () => {
                expect(loadHobbiesStub.called).toBeFalsy();
            });
        });

        describe('when total and threshold are equal', () => {
            beforeEach(() => {
                hobbyList._state.total = 4;

                hobbyList._handleFooterClick(event);
            });

            it('should not increase threshold', () => {
                expect(hobbyList._state.threshold).toBe(4);
            });

            it('should not call loadHobbies', () => {
                expect(loadHobbiesStub.called).toBeFalsy();
            });
        });

        describe('when there are more items then threshold', () => {
            describe('when we click once', () => {
                beforeEach(() => {
                    hobbyList._state.total = 10;
    
                    hobbyList._handleFooterClick(event);
                });
    
                it('should increase threshold', () => {
                    expect(hobbyList._state.threshold).toBe(8);
                });
    
                it('should call loadHobbies', () => {
                    expect(loadHobbiesStub.called).toBeTruthy();
                });

                it('should call loadHobbies with correct params', () => {
                    expect(loadHobbiesStub.withArgs(4, 2)).toBeTruthy();
                });
            });

            describe('then we click twice', () => {
                beforeEach(() => {
                    hobbyList._state.total = 10;
    
                    hobbyList._handleFooterClick(event);
                    hobbyList._handleFooterClick(event);
                });

                it('should increase threshold to 10', () => {
                    expect(hobbyList._state.threshold).toBe(10);
                });

                it('should call loadHobbies twice', () => {
                    expect(loadHobbiesStub.calledTwice).toBeTruthy();
                })

                it('should call loadHobbies firstly with correct params', () => {
                    expect(loadHobbiesStub.args[0][1]).toBe(4);
                });

                it('should call loadHobbies secondly with correct params', () => {
                    expect(loadHobbiesStub.args[1][1]).toBe(2);
                });
            });

            describe('when user click 3 times', () => {
                beforeEach(() => {
                    hobbyList._state.total = 10;
    
                    hobbyList._handleFooterClick(event);
                    hobbyList._handleFooterClick(event);
                    hobbyList._handleFooterClick(event);
                });

                it('should call loadHobbies only twice', () => {
                  expect(loadHobbiesStub.calledTwice).toBeTruthy();  
                });

                it('should decrease threshold to 4', () => {
                    expect(hobbyList._state.threshold).toBe(4);
                });
            });
        })
    });
});
