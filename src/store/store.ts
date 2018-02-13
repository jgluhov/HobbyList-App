/**
 * HobbyListApp | Store
 */
import { Hobby } from '@models';

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

    public get(startIndex: number = 0, count: number = 0): Promise<StoreResponse> {
        return new Promise((resolve: PromiseResolve<StoreResponse>): void => {
            let items: Hobby[];

            if (startIndex < 0 && startIndex + count === 0) {
                items = this._data.slice(startIndex);
            } else {
                items = this._data.slice(startIndex, startIndex + count);
            }

            resolve({
                items,
                total: this.length()
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
