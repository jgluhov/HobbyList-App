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
    public root: ShadowRoot;
    public content: DocumentFragment;
    public state: HobbyFormState = {};
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

    static get observedAttributes(): string[] {
        return [
            'belonging'
        ];
    }

    public attributeChangedCallback(
        attrName: string,
        oldVal: string,
        newVal: string
    ): void {
        this.state[attrName] = newVal;
    }

    public connectedCallback(): void {
        this.$form = this.root.querySelector('form[name="hobby-form"]');
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
        const hobby: Models.Hobby = new Models.Hobby(text, this.state.belonging);
        Utils.dispatchEvent<Models.Hobby>('hobby:create', hobby);
    }

    public hiddenBtn(hide: boolean): void {
        if (hide) {
            this.$btn.setAttribute('hidden', '');
        } else {
            this.$btn.removeAttribute('hidden');
        }
    }
}
