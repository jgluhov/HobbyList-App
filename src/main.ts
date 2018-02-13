/**
 * HobbyForm Main
 */
import { HobbyForm, HobbyList } from '@components';
import { Hobby } from '@models';
import './styles/main.scss';

async function main(): Promise<void> {
    customElements.define('hobby-form', HobbyForm);
    customElements.define('hobby-list', HobbyList);

    await customElements.whenDefined('hobby-form');
    await customElements.whenDefined('hobby-list');

    document.addEventListener('hobby:create', handleHobbyCreate);
}

function handleHobbyCreate(e: CustomEvent): void {

}

window.addEventListener('load', main);
