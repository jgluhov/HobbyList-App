/**
 * HobbyListApp | Store
 */
import { Belonging, Hobby } from '@models';

interface IStore {
    create(hobby: Hobby): Promise<StoreResponse>;
    get(startIndex?: number, count?: number, belonging?: string): Promise<StoreResponse>;
    delete(id: string, belonging?: string): Promise<StoreResponse>;
    getAll(): Promise<StoreResponse>;
    length(belonging?: string): number;
    _clear(): void;
}

const DELAY_MS: number = DEVELOPMENT ? 0 : 1000;

export type StoreResponse = {
    items: Hobby[];
    total: number;
};

type DelayFn = (ms: number) => Promise<void>;

export const Store: IStore = ((): IStore => {
    let _data: Hobby[] = [];

    const delay: DelayFn = (ms: number): Promise<void> => {
        return new Promise(
            (resolve: (value?: void) => void): number => setTimeout(resolve, ms)
        );
    };

    return {
        async create(hobby: Hobby): Promise<StoreResponse> {
            _data = [
                ..._data,
                hobby
            ];

            await delay(DELAY_MS);

            return Promise.resolve({
                items: [ ..._data ],
                total: _data.length
            });
        },

        async get(
            startIndex: number = 0,
            count: number = 0,
            belonging: string = Belonging.OWN
        ): Promise<StoreResponse> {
            const filteredHobbies: Hobby[] = _data.filter((hobby: Hobby) => hobby.belonging === belonging);
            const items: Hobby[] = filteredHobbies.slice(startIndex, startIndex + count);

            await delay(DELAY_MS);

            return Promise.resolve({
                items,
                total: filteredHobbies.length
            });
        },

        async delete(id: string, belonging: string = Belonging.OWN): Promise<StoreResponse>  {
            _data = _data
                .filter((hobby: Hobby) => hobby.id !== id)
                .filter((hobby: Hobby) => hobby.belonging === belonging);

            await delay(DELAY_MS);

            return Promise.resolve({
                items: [],
                total: _data.length
            });
        },

        async getAll(): Promise<StoreResponse> {
            await delay(DELAY_MS);

            return Promise.resolve({
                items: [ ..._data ],
                total: _data.length
            });
        },

        length(belonging: string = Belonging.OWN): number {
            return _data.filter(
                (hobby: Hobby) => hobby.belonging === belonging
            ).length;
        },

        _clear(): void {
            _data = [];
        }
    };
})();
