/**
 * HobbyListApp | Store Spec
 */
import { Belonging, Hobby } from '@models';
import { GETResponse, Store, SUCCESSResponse } from '@store';

xdescribe('Store: Spec', () => {
    let ownHobby1: Hobby;
    let ownHobby2: Hobby;
    let ownHobby3: Hobby;
    let ownHobby4: Hobby;
    let ownHobby5: Hobby;
    let ownHobby6: Hobby;
    let friendHobby1: Hobby;
    let getResponse: GETResponse;
    let successResponse: SUCCESSResponse;

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
                getResponse = await Store.getAll();
                expect(getResponse.items).toEqual([]);
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

                getResponse = await Store.getAll();

                expect(getResponse.items).toEqual([ ownHobby1, ownHobby2 ]);
            });
        });
    });

    describe('#remove()', () => {
        let hobbies: Hobby[];

        beforeEach(() => {
            hobbies = [ ownHobby1, ownHobby2, ownHobby3 ];
            hobbies.forEach(Store.create.bind(Store));
        });

        describe('when we call remove method', () => {
            describe('when we pass wrong id', () => {
                beforeEach(async() => {
                    successResponse = await Store.delete('unknownId');
                    getResponse = await Store.getAll();
                });

                it('should return correct response total', () => {
                    expect(getResponse.total).toBe(3);
                });

                it('should return correct response items', () => {
                    expect(getResponse.items).toEqual(hobbies);
                });

                it('should not remove any', async() => {
                    expect(Store.length()).toBe(3);
                });
            });

            describe('when we remove first element', () => {
                beforeEach(async() => {
                    successResponse = await Store.delete(hobbies.shift().id);
                    getResponse = await Store.getAll();
                });

                it('should reponds with ok', () => {
                    expect(successResponse).toBe('OK');
                });

                it('should return correct response total', () => {
                    expect(getResponse.total).toBe(2);
                });

                it('should return correct response items', () => {
                    expect(getResponse.items).toEqual([
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
                    await Store.create(ownHobby1);
                    await Store.create(ownHobby2);
                    await Store.create(ownHobby3);

                    getResponse = await Store.get();
                    expect(getResponse).toEqual({
                        items: [],
                        total: 3
                    });
                });
            });
        });

        describe('when we call get() method with params', () => {
            beforeEach(async() => {
                await Store.create(ownHobby1);
                await Store.create(ownHobby2);
                await Store.create(ownHobby3);
                await Store.create(ownHobby4);
                await Store.create(ownHobby5);
                await Store.create(ownHobby6);
                await Store.create(friendHobby1);
            });

            describe('when startIndex is equal to 0 and count equal to 1', () => {
                it('should return correct response', async() => {
                    getResponse = await Store.get(0, 1);
                    expect(getResponse).toEqual({
                        items: [ownHobby1],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to -4 and count equal to -1', () => {
                it('should return correct response', async() => {
                    getResponse = await Store.get(4, 1);
                    expect(getResponse).toEqual({
                        items: [ownHobby5],
                        total: 6
                    });
                });
            });

            describe('when startIndex is equal to 6 and count equal to 1', () => {
                it('should return correct response', async() => {
                    getResponse = await Store.get(6, 1);
                    expect(getResponse).toEqual({
                        items: [],
                        total: 6
                    });
                });
            });

            describe('when we delete hobby-1 and hobby 5', () => {
                it('should return correct response', async() => {
                    await Store.delete(ownHobby1.id);
                    await Store.delete(ownHobby5.id);

                    getResponse = await Store.get(0, 4);
                    expect(getResponse).toEqual({
                        items: [ownHobby2, ownHobby3, ownHobby4, ownHobby6],
                        total: 4
                    });
                });
            });
        });
    });

    describe('#patch()', () => {
        let changedHobby: Hobby;

        beforeEach(async() => {
            await Store.create(friendHobby1);
        });

        describe('when we patch hobby with incorrect id', () => {
            beforeEach(async() => {
                await Store.patch('some id', {
                    belonging: Belonging.OWN
                });
            });

            it('should not change store', async() => {
                getResponse = await Store.getAll();

                expect(getResponse).toEqual({
                    items: [friendHobby1],
                    total: 1
                });
            });
        });

        describe('when we patch hobby with correct id', () => {
            beforeEach(async() => {
                successResponse = await Store.patch(friendHobby1.id, {
                    belonging: Belonging.OWN
                });

                changedHobby = {
                    ...friendHobby1,
                    belonging: Belonging.OWN
                };
            });

            it('should responds with ok', () => {
                expect(successResponse).toBe('OK');
            });

            it('should change store', async() => {
                getResponse = await Store.getAll();

                expect(getResponse).toEqual({
                    items: [changedHobby],
                    total: 1
                });
            });
        });
    });
});
