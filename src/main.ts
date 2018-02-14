/**
 * HobbyForm Main
 */
import { HobbyForm, HobbyList } from '@components';
import { Hobby } from '@models';
import { store } from '@store';
import './styles/main.scss';

async function main(): Promise<void> {
    customElements.define('hobby-form', HobbyForm);
    customElements.define('hobby-list', HobbyList);

    await customElements.whenDefined('hobby-form');
    await customElements.whenDefined('hobby-list');

    addEventListener('hobby:create', handleHobbyCreate);
}

function handleHobbyCreate(e: CustomEvent): void {
    store.append(e.detail.data);
}

addEventListener('load', main);
