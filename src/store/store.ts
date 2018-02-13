/**
 * HobbyListApp | Store
 */
import { Hobby } from '@models';

type StoreResponse = {
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

    public get(): Promise<StoreResponse> {
        return new Promise((resolve: PromiseResolve<StoreResponse>): void => {
            resolve({
                items: [],
                total: 0
            });
        });
    }

    public getAll(): Hobby[] {
        return this._data;
    }

    public length(): number {
        return this._data.length;
    }
}

export const store: Store = new Store();
