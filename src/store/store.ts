/**
 * HobbyListApp | Store
 */
import { Belonging, Hobby } from '@models';
import * as Utils from '@utils';

interface IStore {
    post(hobby: Hobby): Promise<SUCCESSResponse>;
    get(startIndex?: number, count?: number, belonging?: string): Promise<GETResponse>;
    delete(id: string): Promise<SUCCESSResponse>;
    patch(id: string, data?: Partial<Hobby>): Promise<SUCCESSResponse>;
    getAll(): Promise<GETResponse>;
    _fill(hobbies: Hobby[]): void;
    _clear(): void;
}

const DELAY_MS: number = DEVELOPMENT ? 5000 : 500;
const SUCCESS_RESPONSE: string = 'OK';

export type GETResponse = {
    items: Hobby[];
    total: number;
};
export type SUCCESSResponse = string;

type DelayFn = (ms: number) => Promise<void>;
type DispatchFn = (belonging: string) => void;

export const Store: IStore = ((): IStore => {
    let _data: Hobby[] = [];

    const delay: DelayFn = (ms: number): Promise<void> => {
        return new Promise(
            (resolve: (value?: void) => void): number => setTimeout(resolve, ms)
        );
    };

    const dispatchUpdate: DispatchFn  = (belonging: string): void => {
        Utils.dispatchEvent(`store:update:${belonging}`);
    };

    return {
        async post(hobby: Hobby): Promise<SUCCESSResponse> {
            _data = [
                ..._data,
                hobby
            ];

            await delay(DELAY_MS);
            dispatchUpdate(hobby.belonging);

            return Promise.resolve(SUCCESS_RESPONSE);
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

        async patch(id: string, data: Partial<Hobby>): Promise<SUCCESSResponse> {
            const foundHobby: Hobby = _data.find((hobby: Hobby) => hobby.id === id);
            if (!foundHobby) {
                Promise.reject(`There are no hobby with this id - ${id}`);
            }
            _data = _data.filter((hobby: Hobby) => hobby.id !== id);

            const changedHobby: Hobby = {
                id: foundHobby.id,
                ...foundHobby,
                ...data
            };
            _data = [
                ..._data,
                changedHobby
            ];

            await delay(DELAY_MS);
            dispatchUpdate(changedHobby.belonging);

            return Promise.resolve(SUCCESS_RESPONSE);
        },

        async delete(id: string): Promise<SUCCESSResponse>  {
            const foundHobby: Hobby = _data.find((hobby: Hobby) => hobby.id === id);
            if (!foundHobby) {
                return Promise.reject(`There are no hobby with this id - ${id}`);
            }

            _data = _data
                .filter((h: Hobby) => h.id !== id);

            await delay(DELAY_MS);
            dispatchUpdate(foundHobby.belonging);

            return Promise.resolve(SUCCESS_RESPONSE);
        },

        async getAll(): Promise<GETResponse> {
            await delay(DELAY_MS);

            return Promise.resolve({
                items: [ ..._data ],
                total: _data.length
            });
        },

        _fill(hobbies: Hobby[]): void {
            _data = [ ...hobbies ];
        },

        _clear(): void {
            _data = [];
        }
    };
})();
