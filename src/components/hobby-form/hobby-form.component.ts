/**
 * HobbyList | Hobby Form
 */
import * as Models from '@models';
import * as Utils from '@utils';

import styles from './hobby-form.styles.scss';
import template from './hobby-form.template.html';

type HobbyFormState = {
    belonging?: string;
};

export class HobbyForm extends HTMLElement {
    public _shadowRoot: ShadowRoot;
    public _state: HobbyFormState = {};
    public $form: HTMLFormElement;
    public $btn: HTMLButtonElement;
    public $input: HTMLInputElement;

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
            'belonging'
        ];
    }

    public attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
        this._state[attrName] = newVal;
    }

    public connectedCallback(): void {
        this.$form = this._shadowRoot.querySelector('[name="hobby-form"]');
        this.$btn = this.$form.querySelector('.form__btn');
        this.$input = this.$form.querySelector('.form__input');

        this._addEventListeners();
    }

    public _addEventListeners(): void {
        document.addEventListener('click', this._handleDocumentClick);
        this.$form.addEventListener('click', this._handleClick);
    }

    public _handleClick = (e: MouseEvent): void => {
        const tagName: string = (<HTMLElement>e.target).tagName.toLowerCase();

        if (tagName === 'input') {
            this._handleInputClick(e);
        } else if (tagName === 'button') {
            this._handleSubmit(e);
        }
    }

    public _handleInputClick(e: MouseEvent): void {
        e.stopPropagation();
        this._hiddenBtn(false);
    }

    public _handleSubmit(e: MouseEvent): void {
        e.preventDefault();

        if (this.$form.checkValidity()) {
            this._createHobby(this.$input.value);
            this.$input.value = '';
            this._hiddenBtn(true);
        }
    }

    public _handleDocumentClick = (e: MouseEvent): void => {
        if (!this.$input.value) {
            this._hiddenBtn(true);
        }
    }

    public _createHobby(text: string): void {
        const hobby: Models.Hobby = new Models.Hobby(text, this._state.belonging);
        Utils.dispatchEvent<Models.Hobby>('hobby:create', hobby);
    }

    public _hiddenBtn(hide: boolean): void {
        if (hide) {
            this.$btn.setAttribute('hidden', '');
        } else {
            this.$btn.removeAttribute('hidden');
        }
    }
}
