/**
 * HobbyListApp | Hobby List Component
 */
import * as Models from '@models';
import * as Store from '@store';
import * as Utils from '@utils';
import * as HobbyListConstants from './hobby-list.constants';
import { HobbyListService } from './hobby-list.service';

import styles from './hobby-list.styles.scss';
import template from './hobby-list.template.html';

type HobbyListState = {
    threshold: number;
    length: number;
    belonging: string;
    renderingIndex: number;
    loading: boolean;
    items: Models.Hobby[];
    total: number;
};

export class HobbyList extends HTMLElement {
    public _shadowRoot: ShadowRoot;
    public $listContent: HTMLDivElement;
    public $listFooter: HTMLDialogElement;
    public service: HobbyListService = new HobbyListService();
    public _state: HobbyListState = {
        threshold: HobbyListConstants.DEFAULT_LENGTH,
        length: HobbyListConstants.DEFAULT_LENGTH,
        belonging: Models.Belonging.OWN,
        renderingIndex: 0,
        loading: false,
        items: [],
        total: 0
    };

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
            'belonging', 
            'length'
        ];
    }

    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        if (attrName === 'belonging') {
            this._state.belonging = newValue;
        } else if (attrName === 'length') {
            this._state.length = +newValue || HobbyListConstants.DEFAULT_LENGTH;
        }
    }

    public connectedCallback(): void {
        this.initiate();
    }

    public async initiate(): Promise<void> {
        this.$listContent = this._shadowRoot.querySelector(HobbyListConstants.CONTENT_QUERY);        
        this.$listFooter = this._shadowRoot.querySelector(HobbyListConstants.FOOTER_QUERY);
        
        this.$listContent.parentElement.classList.add(`hobby-list--${this._state.belonging}`);
        
        this.$listContent.addEventListener('animationend', this._handleAnimationEnd.bind(this), false);
        this.$listFooter.addEventListener('click', this._handleFooterClick.bind(this), false);
        
        await this._loadHobbies(0, this._state.threshold);

        this._render();
    }

    public async _loadHobbies(startIndex: number, count: number): Promise<Store.StoreResponse> {
        this._setLoading(true);
        
        const response: Store.StoreResponse = await Store.store.get(
            startIndex,
            count
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

        return response;
    }

    public _setLoading(loading: boolean): void {
        this._state.loading = loading;

        const fn: string = loading ? 'add' : 'remove';
        this.$listContent.classList[fn](HobbyListConstants.CONTENT_LOADING_CLASS);
    }

    public _render(): void {
        this._renderContent();
        this._renderFooter();
    }

    public _renderContent(): void {
        while(this._state.renderingIndex > this._state.threshold) {
            this._remove(this._state.renderingIndex - 1);
        }

        while(
            this._state.renderingIndex < this._state.threshold && 
            this._state.renderingIndex < this._state.items.length
        ) {
            const hobby: Models.Hobby = this._state.items[this._state.renderingIndex];
            this._insert(this._state.renderingIndex, hobby);
        }
    }

    public _renderFooter(): void {
        if (!this._state.total) {
            this._hiddenFooter(false);
            this._setFooterText('Список пуст');
        }

        if (this._state.total > 0) {
            if(this._state.total <= this._state.length) {
                this._hiddenFooter(true);
                this._setFooterText();
            } else {
                this._hiddenFooter(false);
                const remainingCount: number = this._state.total - this._state.threshold;
    
                if (remainingCount > 0) {
                    this._setFooterText(
                        HobbyListConstants
                            .FOOTER_REMAINING_LABEL
                            .replace('{n}', remainingCount.toString())
                    );
                } else {
                    this._setFooterText(HobbyListConstants.FOOTER_ROLL_UP_LABEL);
                }
            }
        }
    }

    public _insert(indexAt: number, hobby: Models.Hobby) {
        const prevEl: HTMLLIElement = <HTMLLIElement>this.$listContent
            .children.item(indexAt);
        
        const newEl = this.service.toElements([ hobby ]);
        newEl.firstElementChild.classList.add(HobbyListConstants.LIST_ITEM_INSERTED_CLASS);
        
        this.$listContent.insertBefore(newEl, prevEl);
        this._state.renderingIndex += 1;
    }

    public async _remove(indexAt: number, force?: boolean) {
        const el: HTMLLIElement = <HTMLLIElement>this.$listContent
            .children.item(indexAt);

        if (!el) {
            return;
        }

        if (force) {
            console.log('should remove from store');
        } else {
            el.classList.add(HobbyListConstants.LIST_ITEM_REMOVED_CLASS);
            this._state.renderingIndex -= 1;
        }
    }

    public _setFooterText(text: string = ''): void {
        this.$listFooter.textContent = text;
    }

    public _hiddenFooter(hidden: boolean): void {
        this.$listFooter.hidden = hidden;
    }

    public async _handleFooterClick(e: MouseEvent): Promise<void> {
        if (!this._state.total) {
            return;
        }

        if (this._state.threshold < this._state.total) {
            const loadCount = Math.min(
                this._state.threshold + HobbyListConstants.DEFAULT_LENGTH,
                this._state.total
            ) - this._state.threshold;
            
            this._state.threshold += loadCount;

            await this._loadHobbies(this._state.items.length, loadCount);
            
        } else {
            this._state.threshold = this._state.length;
        }

        this._render();
    }

    public _handleAnimationEnd(e: AnimationEvent): void {
        const el: HTMLElement = this.service.getElement(e);

        if (e.animationName === 'appearing') {
            el.classList.remove(HobbyListConstants.LIST_ITEM_INSERTED_CLASS);
        }

        if (e.animationName === 'disappearing') {
            el.parentElement.removeChild(el);
        }
    }
 }
