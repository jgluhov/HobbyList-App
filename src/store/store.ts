/**
 * HobbyListApp | Store
 */
import { Hobby } from "@models";

class Store<T> {
    private data: T[] = [];

    public add(hobby: T): void {
        this.data.push(hobby);
    }
}

export const store: Store<Hobby> = new Store();