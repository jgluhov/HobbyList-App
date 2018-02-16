/**
 * HobbyListApp | HobbyList Service
 */
import { Hobby } from '@models';

export class HobbyListService {
    public toElements(hobbies: Hobby[]): DocumentFragment {
        const fragment: DocumentFragment = document.createDocumentFragment();

        hobbies.forEach((hobby: Hobby) => {
            const li: HTMLLIElement = document.createElement('li');
            const span: HTMLSpanElement = document.createElement('span');

            span.className = 'hobby-list__icon';
            li.appendChild(span);

            li.id = hobby.id;
            li.className = 'hobby-list__item';
            li.appendChild(document.createTextNode(hobby.text));

            fragment.appendChild(li);
        });

        return fragment;
    }
}
