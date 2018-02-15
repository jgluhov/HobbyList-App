/**
 * HobbyListApp | Hobby List Component
 */
import * as Models from '@models';
import * as Store from '@store';
import * as Utils from '@utils';

import { HobbyListService } from './hobby-list.service';

import styles from './hobby-list.styles.scss';
import template from './hobby-list.template.html';

type HobbyListState = {
    threshold: number;
    renderedIndex: number;
    belonging: string;
    loading: boolean;
    limit: number;
    items: Models.Hobby[];
    total: number;
};

export class HobbyList extends HTMLElement {
    public _state: HobbyListState;
    public _shadowRoot: ShadowRoot;
    public $listContent: HTMLDivElement;
    public service: HobbyListService = new HobbyListService();

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

    public connectedCallback(): void {
        this.initiate();
    }

    public async initiate(): Promise<void> {
        const belonging: string = this.getAttribute('belonging') || Models.Belonging.OWN;
        const threshold: number = +this.getAttribute('threshold') || 4;

        this.$listContent = this._shadowRoot.querySelector('.hobby-list__content');

        this._state = {
            threshold,
            belonging,
            renderedIndex: 0,
            loading: false,
            limit: threshold,
            items: [],
            total: 0
        };

        await this.loadHobbies();
        this.render();
    }

    public async loadHobbies(): Promise<void> {
        this._setLoading(true);

        const response: Store.StoreResponse = await Store.store.get(
            this._state.renderedIndex,
            this._state.threshold
        );

        this._state = {
            ...this._state,
            items: [
                ...this._state.items,
                ...response.items
            ],
            total: response.total
        };

        this._setLoading(false);
    }

    public _setLoading(loading: boolean): void {
        this._state.loading = loading;

        const fn: string = loading ? 'add' : 'remove';
        this.$listContent.classList[fn]('hobby-list__content--loading');
    }

    public render(): void {
        this.renderContent();
        this.renderFooter();
    }

    public renderContent(): void {
        console.log(this._state);
    }

    public renderFooter(): void {
        console.log(this._state);
    }
 }
