/**
 * HobbyListApp | Store
 */
import { Belonging, Hobby } from '@models';

export type StoreResponse = {
    items: Hobby[];
    total: number;
};

export const Store = function() {
    let _data: Hobby[] = [];

    return {
        async create(hobby: Hobby): Promise<StoreResponse> {
            _data = [
                ..._data,
                hobby
            ];
    
            return await {
                items: [ ..._data ],
                total: _data.length
            }
        },

        async get(
            startIndex: number = 0, 
            count: number = 0, 
            belonging: string = Belonging.OWN
        ): Promise<StoreResponse> { 
            const filteredHobbies: Hobby[] = _data.filter((hobby: Hobby) => hobby.belonging === belonging);
            const items: Hobby[] = filteredHobbies.slice(startIndex, startIndex + count);
    
            await this.delay(1000);
    
            return {
                items,
                total: filteredHobbies.length
            };
        },

        async delete(id: string): Promise<StoreResponse>  {
            _data = _data
                .filter((hobby: Hobby) => hobby.id !== id);
            
            return await {
                items: [ ..._data ],
                total: _data.length
            };
        },
    
        async getAll(): Promise<StoreResponse> {
            return await { 
                items: [ ..._data ],
                total: _data.length
            };
        },
    
        length(belonging: string = Belonging.OWN): number {
            return _data.filter((hobby: Hobby) => hobby.belonging === belonging).length;
        },

        delay(ms: number): Promise<void> {
            return new Promise(
                resolve => setTimeout(resolve, ms)
            );
        },

        _clear(): void {
            _data = [];
        }
    }
}();
