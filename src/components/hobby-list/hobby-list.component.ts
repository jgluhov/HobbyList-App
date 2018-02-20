/**
 * HobbyListApp | Hobby List Component
 */
import { Belonging, Hobby } from '@models';
import { GETResponse, Store, SUCCESSResponse } from '@store';
import * as Utils from '@utils';
import * as HobbyListConstants from './hobby-list.constants';
import { HobbyListService } from './hobby-list.service';

import styles from './hobby-list.styles.scss';
import template from './hobby-list.template.html';

type HobbyListState = {
    threshold: number;
    length: number;
    step: number;
    belonging: string;
    renderingIndex: number;
    loading: boolean;
    items: Hobby[];
    total: number;
};

export class HobbyList extends HTMLElement {
    public $list: HTMLDivElement;
    public $listContent: HTMLDivElement;
    public $listFooter: HTMLDialogElement;
    public _shadowRoot: ShadowRoot;
    public _service: HobbyListService = new HobbyListService();
    public _state: HobbyListState = {
        threshold: HobbyListConstants.DEFAULT_LENGTH,
        length: HobbyListConstants.DEFAULT_LENGTH,
        step: HobbyListConstants.THRESHOLD_STEP,
        belonging: Belonging.OWN,
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
            'length',
            'step'
        ];
    }

    public attributeChangedCallback(
        attrName: string,
        oldValue: string,
        newValue: string
    ): void {
        if (attrName === 'belonging') {
            this._state.belonging = newValue;
        } else if (attrName === 'length') {
            const length: number = !isNaN(+newValue) ?
                +newValue : HobbyListConstants.DEFAULT_LENGTH;
            this._state.threshold = this._state.length = length;
        } else if (attrName === 'step') {
            this._state.step = !isNaN(+newValue) ?
                +newValue : HobbyListConstants.THRESHOLD_STEP;
        }
    }

    public connectedCallback(): void {
        this.initiate();
    }

    public async initiate(): Promise<void> {
        this.$listContent = this._shadowRoot
            .querySelector(HobbyListConstants.CONTENT_QUERY);
        this.$listFooter = this._shadowRoot
            .querySelector(HobbyListConstants.FOOTER_QUERY);

        this.$listContent.parentElement
            .classList.add(`hobby-list--${this._state.belonging}`);

        this._shadowRoot.addEventListener(
            'animationend',
            this._handleAnimation.bind(this)
        );
        this._shadowRoot.addEventListener(
            'click',
            this._handleClick.bind(this)
        );

        const response: GETResponse = await this._loadHobbies(0, this._state.threshold);
        this._updateState(response);

        this._render();

        addEventListener(
            `store:update:${this._state.belonging}`,
            this._handleStoreUpdate.bind(this)
        );
    }

    public async _handleStoreUpdate(): Promise<void> {
        const response: GETResponse = await this._loadHobbies();
        this._updateState(response);
        this._render();
    }

    public async _loadHobbies(
        startIndex: number = 0,
        count: number = 0
    ): Promise<GETResponse> {

        this._setLoading(true);

        const response: GETResponse = await Store.get(
            startIndex, count,
            this._state.belonging
        );

        this._setLoading(false);

        return response;
    }

    public async _removeHobby(id: string): Promise<string> {
        this._setLoading(true);

        const response: SUCCESSResponse = await Store.delete(id);

        this._setLoading(false);

        return response;
    }

    public async _updateHobby(id: string, data: Partial<Hobby>): Promise<string> {
        this._setLoading(true);

        const response: SUCCESSResponse = await Store.patch(id, data);

        this._setLoading(false);

        return response;
    }

    public _updateState(response: GETResponse): void {
        this._state = {
            ...this._state,
            items: [
                ...this._state.items,
                ...response.items
            ],
            total: response.total
        };
    }

    public _setLoading(loading: boolean): void {
        this._state.loading = loading;

        const fn: string = loading ? 'add' : 'remove';
        this.$listContent.classList[fn](
            HobbyListConstants.CONTENT_LOADING_CLASS
        );
    }

    public _render(): void {
        this._renderContent();
        this._renderFooter();
    }

    public _renderContent(): void {
        while (this._state.renderingIndex > this._state.threshold) {
            this._remove(this._state.renderingIndex - 1);
        }

        while (
            this._state.renderingIndex < this._state.threshold &&
            this._state.renderingIndex < this._state.items.length
        ) {
            const hobby: Hobby = this._state.items[
                this._state.renderingIndex
            ];
            this._insert(hobby);
        }
    }

    public _renderFooter(): void {
        if (!this._state.total) {
            this._hiddenFooter(false);
            this._setFooterText('Список пуст');
        }

        if (this._state.total > 0) {
            if (this._state.total <= this._state.length) {
                this._hiddenFooter(true);
                this._setFooterText();
            } else {
                this._hiddenFooter(false);
                const remainingCount: number = this._state.total -
                    Math.min(
                        this._state.threshold,
                        this._state.renderingIndex
                    );

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

    public _insert(hobby: Hobby): void {
        const newEl: DocumentFragment = this._service.toElements([ hobby ]);
        newEl.firstElementChild.classList.add(
            HobbyListConstants.LIST_ITEM_INSERTED_CLASS
        );

        this.$listContent.appendChild(newEl);
        this._state.renderingIndex += 1;
    }

    public async _remove(indexAt: number, force?: boolean): Promise<void> {
        const el: HTMLLIElement = <HTMLLIElement>this.$listContent
            .children.item(indexAt);

        if (!el) {
            return;
        }

        if (force) {
            await Store.delete(el.id);
            this._state.items = this._state.items
                .filter((hobby: Hobby) => hobby.id !== el.id);
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

    public _handleClick(e: MouseEvent): void {
        e.preventDefault();

        const target: HTMLElement = this._service.getElement(e);

        if (this._state.loading) {
            return;
        }

        if (target.isEqualNode(this.$listFooter)) {
            this._handleFooterClick(e);
        }

        if (this.$listContent.contains(target)) {
            this._handleListClick(e);
        }
    }

    public async _handleFooterClick(e: MouseEvent): Promise<void> {
        if (!this._state.total) {
            return;
        }

        if (this._state.threshold < this._state.total) {
            const startIndex: number = Math.min(
                this._state.threshold,
                this._state.renderingIndex
            );
            const next: number = Math.min(
                startIndex + this._state.step,
                this._state.total
            );
            this._state.threshold += next - this._state.threshold;

            if (this._state.threshold > this._state.items.length) {
                const count: number = this._state.threshold - this._state.items.length;
                const response: GETResponse = await this._loadHobbies(
                    this._state.items.length,
                    count
                );

                this._updateState(response);
            }
        } else {
            this._state.threshold = this._state.length;
        }

        this._render();
    }

    public async _handleListClick(e: MouseEvent): Promise<void> {
        const target: HTMLElement = this._service.getElement(e);

        if (this._service.is(target, 'span') &&
            this._state.belonging === Belonging.OWN
        ) {
            await this._removeHobby(target.parentElement.id);
            this._handleRemove(target.parentElement);
        }

        if (this._service.is(target, 'li') &&
            this._state.belonging === Belonging.FRIEND
        ) {
            await this._updateHobby(target.id, { belonging: Belonging.OWN });
            target.classList
                .add(HobbyListConstants.LIST_ITEM_SELECTED_CLASS);
            this._handleRemove(target);
        }

        if (this._state.total > this._state.items.length) {
            const response: GETResponse = await this._loadHobbies(
                this._state.renderingIndex, 1
            );
            this._updateState(response);
            this._render();
        }
    }

    public _handleRemove(el: HTMLElement): void {
        this._state.total -= 1;
        this._state.renderingIndex -= 1;
        this._state.items = this._state.items.filter((hobby: Hobby) => {
            return hobby.id !== el.id;
        });

        el.classList.add(HobbyListConstants.LIST_ITEM_REMOVED_CLASS);

        if (this._state.threshold > this._state.length) {
            this._state.threshold -= 1;
        }
    }

    public _handleAnimation(e: AnimationEvent): void {
        const el: HTMLElement = this._service.getElement(e);

        if (e.animationName === 'appearing') {
            el.classList.remove(HobbyListConstants.LIST_ITEM_INSERTED_CLASS);
        }

        if (e.animationName === 'disappearing') {
            el.parentElement.removeChild(el);
        }
    }
 }
