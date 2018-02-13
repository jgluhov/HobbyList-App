/**
 * HobbyListApp | Store Spec
 */
import { Hobby } from '@models';
import { Store } from '@store';

describe('Store: Spec', () => {
    let store: Store;

    describe('@constructor()', () => {
        describe('when we create store', () => {
            it('should have a clear data array', () => {
                store = new Store();
                expect(store.getAll()).toEqual([]);
            });
        });
    });

    describe('#append()', () => {
        beforeEach(() => {
            store = new Store();
        });

        describe('when we call append method', () => {
            it('should append it to store', () => {
                store.append(new Hobby('first'));
                expect(store.length()).toBe(1);
            });

            it('should append it aftre previous one', () => {
                store.append(new Hobby('first'));
                store.append(new Hobby('second'));

                expect(store.getAll()[1].text).toBe('second');
            });
        });
    });

    describe('#remove()', () => {
        let hobbies: Hobby[];
        beforeEach(() => {
            store = new Store();
            hobbies = [
                new Hobby('first'),
                new Hobby('second'),
                new Hobby('third')
            ];
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
                    store.remove(hobbies[0].id);

                    expect(store.length()).toBe(2);
                });
            });
        });
    });
});
