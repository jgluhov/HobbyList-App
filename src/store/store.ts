/**
 * HobbyListApp | Store
 */
import { Hobby } from '@models';

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

    public getAll(): Hobby[] {
        return this._data;
    }

    public length(): number {
        return this._data.length;
    }
}

export const store: Store = new Store();
