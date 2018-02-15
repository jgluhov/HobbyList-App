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
    loading?: boolean;
};

export class HobbyList extends HTMLElement {
    public _state: HobbyListState = {};
    public _shadowRoot: ShadowRoot;
    public $listContent: HTMLDivElement;

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
        this.initiate();
    }

    public async initiate(): Promise<void> {
        this._state.belonging = this.getAttribute('belonging') || Models.Belonging.OWN;
        this._state.threshold = +this.getAttribute('threshold') || 4;

        this.$listContent = this._shadowRoot.querySelector('.hobby-list__content');

        await this.loadHobbies();

        this.render();
    }

    public async loadHobbies(): Promise<void> {
        this._setLoading(true);

        const response: Store.StoreResponse = await Store.store
            .get(this._state.renderedIndex, this._state.threshold);

        this._setLoading(false);
    }

    public _setLoading(loading: boolean): void {
        this._state.loading = loading;

        const fn: string = loading ? 'add' : 'remove';
        this.$listContent.classList[fn]('hobby-list__content--loading');
    }

    public render = (): void => {

    }
 }
