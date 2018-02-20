/**
 * HobbyListApp | Store
 */
import { Belonging, Hobby } from '@models';

interface IStore {
    create(hobby: Hobby): Promise<SUCCESSResponse>;
    get(startIndex?: number, count?: number, belonging?: string): Promise<GETResponse>;
    delete(id: string, belonging?: string): Promise<SUCCESSResponse>;
    patch(id: string, data?: Partial<Hobby>): Promise<SUCCESSResponse>;
    getAll(): Promise<GETResponse>;
    length(belonging?: string): number;
    _clear(): void;
}

const DELAY_MS: number = DEVELOPMENT ? 0 : 1000;

export type GETResponse = {
    items: Hobby[];
    total: number;
};
export type SUCCESSResponse = string;

type DelayFn = (ms: number) => Promise<void>;

export const Store: IStore = ((): IStore => {
    let _data: Hobby[] = [];

    const delay: DelayFn = (ms: number): Promise<void> => {
        return new Promise(
            (resolve: (value?: void) => void): number => setTimeout(resolve, ms)
        );
    };

    return {
        async create(hobby: Hobby): Promise<SUCCESSResponse> {
            _data = [
                ..._data,
                hobby
            ];

            await delay(DELAY_MS);

            return Promise.resolve('OK');
        },

        async get(
            startIndex: number = 0,
            count: number = 0,
            belonging: string = Belonging.OWN
        ): Promise<GETResponse> {
            const filteredHobbies: Hobby[] = _data.filter((hobby: Hobby) => hobby.belonging === belonging);
            const items: Hobby[] = filteredHobbies.slice(startIndex, startIndex + count);

            await delay(DELAY_MS);

            return Promise.resolve({
                items,
                total: filteredHobbies.length
            });
        },

        async patch(
            id: string,
            data: Partial<Hobby>
        ): Promise<SUCCESSResponse> {
            const foundHobby: Hobby = _data.find((hobby: Hobby) => hobby.id === id);

            _data = _data
                .filter((hobby: Hobby) => hobby.id !== id);

            if (foundHobby) {
                const changedHobby: Hobby = {
                    id: foundHobby.id,
                    ...foundHobby,
                    ...data
                };
                _data = [
                    ..._data,
                    changedHobby
                ];
            }

            await delay(DELAY_MS);

            return Promise.resolve('OK');
        },

        async delete(id: string, belonging: string = Belonging.OWN): Promise<SUCCESSResponse>  {
            _data = _data
                .filter((hobby: Hobby) => hobby.id !== id)
                .filter((hobby: Hobby) => hobby.belonging === belonging);

            await delay(DELAY_MS);

            return Promise.resolve('OK');
        },

        async getAll(): Promise<GETResponse> {
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
