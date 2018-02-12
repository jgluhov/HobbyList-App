/**
 * HobbyList Dom Utils
 */
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
