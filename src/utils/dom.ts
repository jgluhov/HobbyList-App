/**
 * HobbyList Dom Utils
 */

interface IExCustomEventInit extends CustomEventInit {
    composed: boolean;
}

export function createShadowRoot(style: string, template: string): DocumentFragment {
    const templateEl: HTMLTemplateElement = document.createElement('template');
    const styleEl: HTMLStyleElement = document.createElement('style');
    const content: DocumentFragment = document.createDocumentFragment();

    styleEl.innerHTML = style;
    templateEl.innerHTML = template;

    content.appendChild(styleEl);
    content.appendChild(templateEl.content);

    return content;
}

export function dispatchEvent<T>(eventName: string, data?: T): void {
    const customEventInit: IExCustomEventInit = {
        detail: { data },
        bubbles: true,
        composed: true
    };

    document.dispatchEvent(new CustomEvent(eventName, customEventInit));
}
