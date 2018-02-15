/**
 * HobbyListApp | Store
 */
import { Belonging, Hobby } from '@models';

export type StoreResponse = {
    items: Hobby[];
    total: number;
};

type PromiseResolve<T> = {
    (value?: T): void;
};

export class Store {
    private _data: Hobby[] = [];

    public append(hobby: Hobby): void {
        this._data = [
            ...this._data,
            hobby
        ];
    }

    public remove(id: string): void {
        this._data = this._data.filter(
            (hobby: Hobby) => hobby.id !== id
        );
    }

    public get(startIndex: number = 0, count: number = 0, belonging: string = Belonging.OWN): Promise<StoreResponse> {
        return new Promise((resolve: PromiseResolve<StoreResponse>): void => {
            const filteredHobbies: Hobby[] = this._data.filter((hobby: Hobby) => hobby.belonging === belonging);
            const items: Hobby[] = filteredHobbies.slice(startIndex, startIndex + count);

            resolve({
                items,
                total: filteredHobbies.length
            });
        });
    }

    public getAll(): Hobby[] {
        return this._data;
    }

    public length(belonging: string = Belonging.OWN): number {
        return this._data.filter((hobby: Hobby) => hobby.belonging === belonging).length;
    }
}

export const store: Store = new Store();
