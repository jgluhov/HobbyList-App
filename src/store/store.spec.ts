/**
 * HobbyListApp | Store Spec
 */
import { Belonging, Hobby } from '@models';
import { Store, StoreResponse } from '@store';

describe('Store: Spec', () => {
    let store: Store;
    let ownHobby1: Hobby;
    let ownHobby2: Hobby;
    let ownHobby3: Hobby;
    let ownHobby4: Hobby;
    let ownHobby5: Hobby;
    let ownHobby6: Hobby;
    let friendHobby1: Hobby;

    beforeEach(() => {
        store = new Store();
        ownHobby1 = new Hobby('own-hobby-1');
        ownHobby2 = new Hobby('own-hobby-2');
        ownHobby3 = new Hobby('own-hobby-3');
        ownHobby4 = new Hobby('own-hobby-4');
        ownHobby5 = new Hobby('own-hobby-5');
        ownHobby6 = new Hobby('own-hobby-6');
        friendHobby1 = new Hobby('friend-hobby-1', Belonging.FRIEND);
    });

    describe('@constructor()', () => {
        describe('when we create store', () => {
            it('should have a clear data array', async() => {
                const response: StoreResponse = await store.getAll();
                expect(response.items).toEqual([]);
            });
        });
    });

    describe('#create()', () => {
        describe('when we call create method', () => {
            it('should create it to store', async () => {
                await store.create(ownHobby1);
                expect(store.length()).toBe(1);
            });

            it('should create it aftre previous one', async() => {
                await store.create(ownHobby1);
                await store.create(ownHobby2);

                const response: StoreResponse = await store.getAll();
                
                expect(response.items).toEqual([ ownHobby1, ownHobby2 ]);
            });
        });
    });

    describe('#remove()', () => {
        let hobbies: Hobby[];
        let response: StoreResponse;

        beforeEach(() => {
            hobbies = [ ownHobby1, ownHobby2, ownHobby3 ];
            hobbies.forEach(store.create.bind(store));
        });

        describe('when we call remove method', () => {
            describe('when we pass wrong id', () => {
                beforeEach(async() => {
                    response = await store.remove('unknownId');
                });

                it('should return correct response total', () => {
                    expect(response.total).toBe(3);
                });

                it('should return correct response items', () => {
                    expect(response.items).toEqual(hobbies);
                })

                it('should not remove any', async() => {
                    expect(store.length()).toBe(3);
                });
            });

            describe('when we remove first element', () => {
                beforeEach(async() => {
                    response = await store.remove(hobbies.shift().id);
                });

                it('should return correct response total', () => {
                    expect(response.total).toBe(2);
                });

                it('should return correct response items', () => {
                    expect(response.items).toEqual([
                        ownHobby2, ownHobby3
                    ]);
                });

                it('should remove it from store', () => {
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
                    store.create(ownHobby1);
                    store.create(ownHobby2);
                    store.create(ownHobby3);

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
                store.create(ownHobby1);
                store.create(ownHobby2);
                store.create(ownHobby3);
                store.create(ownHobby4);
                store.create(ownHobby5);
                store.create(ownHobby6);
                store.create(friendHobby1);
            });

            describe('when startIndex is equal to 0 and count equal to 1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(0, 1);
                    expect(response).toEqual({
                        items: [ownHobby1],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to -4 and count equal to -1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await store.get(4, 1);
                    expect(response).toEqual({
                        items: [ownHobby5],
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

            describe('when we remove hobby-1 and hobby 5', () => {
                it('should return correct response', async() => {
                    await store.remove(ownHobby1.id);
                    await store.remove(ownHobby5.id);

                    const response: StoreResponse = await store.get(0, 4);
                    expect(response).toEqual({
                        items: [ownHobby2, ownHobby3, ownHobby4, ownHobby6],
                        total: 4
                    });
                });
            });
        });
    });
});
