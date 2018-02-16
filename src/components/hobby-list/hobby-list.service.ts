/**
 * HobbyListApp | HobbyList Service
 */
import { Hobby } from '@models';
import * as hobbyListConstants from './hobby-list.constants';

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
}
