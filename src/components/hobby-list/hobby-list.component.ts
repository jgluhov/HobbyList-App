/**
 * HobbyListApp | Hobby List Component
 */
import * as Models from '@models';
import * as Store from '@store';
import * as Utils from '@utils';

import styles from './hobby-list.styles.scss';
import template from './hobby-list.template.html';

type HobbyListState = {
    threshold?: number;
    renderedIndex?: number;
    belonging?: string;
};

export class HobbyList extends HTMLElement {
    public _state: HobbyListState = {};
    public _shadowRoot: ShadowRoot;
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({
            mode: 'open'
        });

        const content: DocumentFragment = Utils.createShadowRoot(
            styles.toString(),
            template
        );

        this._shadowRoot.appendChild(content);
    }

    static get observedAttributes(): string[] {
        return [
            'belonging', 'threshold'
        ];
    }

    public attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
        this._state[attrName] = newVal;
    }

    public connectedCallback(): void {
        this._state.belonging = this.getAttribute('belonging') || Models.Belonging.OWN;
        this._state.threshold = +this.getAttribute('threshold') || 4;

        this.loadHobbies().then(this.render);
    }

    public loadHobbies(): Promise<Store.StoreResponse> {
        return Store.store
            .get(this._state.renderedIndex, this._state.threshold);

    }

    public render = (response: Store.StoreResponse): void => {
        console.log(response);
    }
 }
