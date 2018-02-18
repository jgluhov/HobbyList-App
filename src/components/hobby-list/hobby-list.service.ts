/**
 * HobbyListApp | HobbyList Service
 */
import { Hobby } from '@models';
import * as hobbyListConstants from './hobby-list.constants';
import * as Store from '@store';

interface IEvent extends Event {
    path?: Node[];
    composedPath?(): Node[];
}

export class HobbyListService {
    public toElements(hobbies: Hobby[]): DocumentFragment {
        const fragment: DocumentFragment = document.createDocumentFragment();

        hobbies.forEach((hobby: Hobby) => {
            const li: HTMLLIElement = document.createElement('li');
            const span: HTMLSpanElement = document.createElement('span');

            span.className = hobbyListConstants.LIST_ICON_CLASS;
            li.appendChild(span);

            li.id = hobby.id;
            li.className = hobbyListConstants.LIST_ITEM_CLASS;;
            li.appendChild(document.createTextNode(hobby.text));

            fragment.appendChild(li);
        });

        return fragment;
    }
    
    public getPath(e: IEvent): Node[] {
        return (e.path || (e.composedPath && e.composedPath())) || [];
    }

    public getElement(e: Event): HTMLElement {
        return <HTMLElement>this.getPath(e).shift();
    }

    public async get(startIndex: number, count: number): Promise<Store.StoreResponse> {
        return await Store.store.get(startIndex, count);
    }

    public async delete(id: string): Promise<number> {
        return await 5;
    }
}
