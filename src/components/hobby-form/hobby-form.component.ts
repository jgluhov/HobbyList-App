/**
 * HobbyList form
 */
import * as Utils from '@Utils';

import styles from './hobby-form.styles.scss';
import template from './hobby-form.template.html';

export class HobbyForm extends HTMLElement {
    public root: ShadowRoot;
    public content: DocumentFragment;
    public $form: HTMLFormElement;
    public $btn: HTMLButtonElement;
    public $input: HTMLInputElement;

    constructor() {
        super();

        this.root = this.attachShadow({
            mode: 'open'
        });

        this.content = Utils.createShadowRoot(
            styles.toString(),
            template
        );

        this.root.appendChild(this.content);
    }

    public connectedCallback(): void {
        this.$form = this.querySelector('form[name="hobby-form"]');
        this.$btn = this.$form.querySelector('.hobby-form__btn');
        this.$input = this.$form.querySelector('.hobby-form__input');

        this.addEventListeners();
    }

    public addEventListeners(): void {
        this.$form.addEventListener('click', this.handleClick);
    }

    public handleClick = (e: MouseEvent): void => {
        const tagName: string = (<HTMLElement>e.target).tagName.toLowerCase();

        if (tagName === 'input') {
            this.handleInputClick(e);
        } else if (tagName === 'button') {
            this.handleSubmit(e);
        }
    }

    public handleInputClick(e: MouseEvent): void {
        e.stopPropagation();
        this.hiddenBtn(false);
    }

    public handleSubmit(e: MouseEvent): void {
        e.preventDefault();

        this.createHobby(this.$input.value);
        this.$input.value = '';
        this.hiddenBtn(true);
    }

    public handleDocumentClick(e: MouseEvent): void {
        if (!this.$input.value) {
            this.hiddenBtn(true);
        }
    }

    public createHobby(text: string): void {
        document.dispatchEvent(new CustomEvent('hobby:create', {
            detail: {text}
        }));
    }

    public hiddenBtn(hide: boolean): void {
        if (hide) {
            this.$btn.setAttribute('aria-hidden', 'true');
        } else {
            this.$btn.removeAttribute('aria-hidden');
        }
    }
}
