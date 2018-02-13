/**
 * HobbyListApp | Hobby List Component
 */
import * as Utils from '@utils';

import styles from './hobby-list.styles.scss';
import template from './hobby-list.template.html';

export class HobbyList extends HTMLElement {
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
 }
