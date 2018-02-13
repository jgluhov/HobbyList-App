/**
 * HobbyListApp | Store Spec
 */
import { Hobby } from '@models';
import { Store, StoreResponse } from '@store';

describe('Store: Spec', () => {
    let store: Store;
    let hobby1: Hobby;
    let hobby2: Hobby;
    let hobby3: Hobby;
    let hobby4: Hobby;
    let hobby5: Hobby;
    let hobby6: Hobby;

    beforeEach(() => {
        store = new Store();
        hobby1 = new Hobby('hobby-1');
        hobby2 = new Hobby('hobby-2');
        hobby3 = new Hobby('hobby-3');
        hobby4 = new Hobby('hobby-4');
        hobby5 = new Hobby('hobby-5');
        hobby6 = new Hobby('hobby-6');
    });

    describe('@constructor()', () => {
        describe('when we create store', () => {
            it('should have a clear data array', () => {
                expect(store.getAll()).toEqual([]);
            });
        });
    });

    describe('#append()', () => {
        describe('when we call append method', () => {
            it('should append it to store', () => {
                store.append(hobby1);
                expect(store.length()).toBe(1);
            });

            it('should append it aftre previous one', () => {
                store.append(hobby1);
                store.append(hobby2);

                expect(store.getAll())
                    .toEqual([ hobby1, hobby2 ]);
            });
        });
    });

    describe('#remove()', () => {
        let hobbies: Hobby[];
        beforeEach(() => {
            hobbies = [ hobby1, hobby2, hobby3 ];
            hobbies.forEach(store.append.bind(store));
        });

        describe('when we call remove method', () => {
            describe('when we pass wrong id', () => {
                it('should not remove any', () => {
                    store.remove('some');

                    expect(store.length()).toBe(3);
                });
            });

            describe('when we remove first element', () => {
                it('should remove it from store', () => {
                    store.remove(hobbies.shift().id);

                    expect(store.length()).toBe(2);
                });
            });
        });
    });

    describe('#get()', () => {
        describe('when we call get() method without params', () => {
            it('should return promisable object', () => {
                expect(store.get())
                    .toEqual(jasmine.any(Promise));
            });

            describe('when our store is not empty', () => {
                it('should return correct total value', async() => {
                    store.append(hobby1);
                    store.append(hobby2);
                    store.append(hobby3);

                    const response: StoreResponse = await store.get();
                    expect(response).toEqual({
                        items: [],
                        total: 3
                    });
                });
            });
        });

        describe('when we call get() method with params', () => {
            beforeEach(() => {
                store.append(hobby1);
                store.append(hobby2);
                store.append(hobby3);
                store.append(hobby4);
                store.append(hobby5);
                store.append(hobby6);
            });

            describe('when startIndex is equal to 0 and count equal to 1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(0, 1);
                    expect(response).toEqual({
                        items: [hobby1],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to -2 and count equal to 2', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(-2, 2);
                    expect(response).toEqual({
                        items: [hobby5, hobby6],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to -4 and count equal to 2', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(-4, 2);
                    expect(response).toEqual({
                        items: [hobby3, hobby4],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to -4 and count equal to -1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(-4, -1);
                    expect(response).toEqual({
                        items: [],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to 10 and count equal to -1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(10, -1);
                    expect(response).toEqual({
                        items: [],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to 6 and count equal to 1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(6, 1);
                    expect(response).toEqual({
                        items: [],
                        total: 6
                    });
                });
            });

            describe('when we remove hobby-4', () => {
                it('should return correct response', async() => {
                    store.remove(hobby4.id);

                    const response: StoreResponse = await store.get(-3, 1);
                    expect(response).toEqual({
                        items: [hobby3],
                        total: 5
                    });
                });
            });

            describe('when we remove hobby-1 and hobby 5', () => {
                it('should return correct response', async() => {
                    store.remove(hobby1.id);
                    store.remove(hobby5.id);

                    const response: StoreResponse = await store.get(0, 4);
                    expect(response).toEqual({
                        items: [hobby2, hobby3, hobby4, hobby6],
                        total: 4
                    });
                });
            });
        });
    });
});
