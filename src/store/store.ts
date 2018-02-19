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

    public async create(hobby: Hobby): Promise<StoreResponse> {
        this._data = [
            ...this._data,
            hobby
        ];

        return await {
            items: [ ...this._data ],
            total: this._data.length
        }
    }

    public delay(ms: number): Promise<void> {
        return new Promise((resolve: PromiseResolve<void>) => setTimeout(resolve, ms));
    }

    public async get(startIndex: number = 0, count: number = 0, belonging: string = Belonging.OWN): Promise<StoreResponse> { 
        const filteredHobbies: Hobby[] = this._data.filter((hobby: Hobby) => hobby.belonging === belonging);
        const items: Hobby[] = filteredHobbies.slice(startIndex, startIndex + count);

        await this.delay(1000);

        return {
            items,
            total: filteredHobbies.length
        };
    }

    public async remove(id: string): Promise<StoreResponse>  {
        this._data = this._data
            .filter((hobby: Hobby) => hobby.id !== id);
        
        return await {
            items: [ ...this._data ],
            total: this._data.length
        };
    }

    public async getAll(): Promise<StoreResponse> {
        return await { 
            items: [ ...this._data ],
            total: this._data.length
        };
    }

    public length(belonging: string = Belonging.OWN): number {
        return this._data.filter((hobby: Hobby) => hobby.belonging === belonging).length;
    }
}

export const store: Store = new Store();
