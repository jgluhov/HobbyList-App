/**
 * HobbyListApp | Store Spec
 */
import { Belonging, Hobby } from '@models';
import { Store, StoreResponse } from '@store';

describe('Store: Spec', () => {
    let ownHobby1: Hobby;
    let ownHobby2: Hobby;
    let ownHobby3: Hobby;
    let ownHobby4: Hobby;
    let ownHobby5: Hobby;
    let ownHobby6: Hobby;
    let friendHobby1: Hobby;

    beforeEach(() => {
        ownHobby1 = new Hobby('own-hobby-1');
        ownHobby2 = new Hobby('own-hobby-2');
        ownHobby3 = new Hobby('own-hobby-3');
        ownHobby4 = new Hobby('own-hobby-4');
        ownHobby5 = new Hobby('own-hobby-5');
        ownHobby6 = new Hobby('own-hobby-6');
        friendHobby1 = new Hobby('friend-hobby-1', Belonging.FRIEND);
    });

    afterEach(() => {
        Store._clear();
    });

    describe('@constructor()', () => {
        describe('when we create store', () => {
            it('should have a clear data array', async() => {
                const response: StoreResponse = await Store.getAll();
                expect(response.items).toEqual([]);
            });
        });
    });

    describe('#create()', () => {
        describe('when we call create method once', () => {
            it('should create it to store', async () => {
                await Store.create(ownHobby1);
                expect(Store.length()).toBe(1);
            });
        });

        describe('when we call create method twice', () => {
            it('should create it aftre previous one', async() => {
                await Store.create(ownHobby1);
                await Store.create(ownHobby2);

                const response: StoreResponse = await Store.getAll();
                
                expect(response.items).toEqual([ ownHobby1, ownHobby2 ]);
            });
        })
    });

    describe('#remove()', () => {
        let hobbies: Hobby[];
        let response: StoreResponse;

        beforeEach(() => {
            hobbies = [ ownHobby1, ownHobby2, ownHobby3 ];
            hobbies.forEach(Store.create.bind(Store));
        });

        describe('when we call remove method', () => {
            describe('when we pass wrong id', () => {
                beforeEach(async() => {
                    response = await Store.delete('unknownId');
                });

                it('should return correct response total', () => {
                    expect(response.total).toBe(3);
                });

                it('should return correct response items', () => {
                    expect(response.items).toEqual(hobbies);
                })

                it('should not remove any', async() => {
                    expect(Store.length()).toBe(3);
                });
            });

            describe('when we remove first element', () => {
                beforeEach(async() => {
                    response = await Store.delete(hobbies.shift().id);
                });

                it('should return correct response total', () => {
                    expect(response.total).toBe(2);
                });

                it('should return correct response items', () => {
                    expect(response.items).toEqual([
                        ownHobby2, ownHobby3
                    ]);
                });

                it('should remove it from Store', () => {
                    expect(Store.length()).toBe(2);
                });
            });
        });
    });

    describe('#get()', () => {
        describe('when we call get() method without params', () => {
            it('should return promisable object', () => {
                expect(Store.get())
                    .toEqual(jasmine.any(Promise));
            });

            describe('when our Store is not empty', () => {
                it('should return correct total value', async() => {
                    Store.create(ownHobby1);
                    Store.create(ownHobby2);
                    Store.create(ownHobby3);

                    const response: StoreResponse = await Store.get();
                    expect(response).toEqual({
                        items: [],
                        total: 3
                    });
                });
            });
        });

        describe('when we call get() method with params', () => {
            beforeEach(() => {
                Store.create(ownHobby1);
                Store.create(ownHobby2);
                Store.create(ownHobby3);
                Store.create(ownHobby4);
                Store.create(ownHobby5);
                Store.create(ownHobby6);
                Store.create(friendHobby1);
            });

            describe('when startIndex is equal to 0 and count equal to 1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await Store.get(0, 1);
                    expect(response).toEqual({
                        items: [ownHobby1],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to -4 and count equal to -1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await Store.get(4, 1);
                    expect(response).toEqual({
                        items: [ownHobby5],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to 6 and count equal to 1', () => {
                it('should return correct response', async() => {
                    const response: StoreResponse = await Store.get(6, 1);
                    expect(response).toEqual({
                        items: [],
                        total: 6
                    });
                });
            });

            describe('when we delete hobby-1 and hobby 5', () => {
                it('should return correct response', async() => {
                    await Store.delete(ownHobby1.id);
                    await Store.delete(ownHobby5.id);

                    const response: StoreResponse = await Store.get(0, 4);
                    expect(response).toEqual({
                        items: [ownHobby2, ownHobby3, ownHobby4, ownHobby6],
                        total: 4
                    });
                });
            });
        });
    });
});
