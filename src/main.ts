/**
 * HobbyForm Main
 */
import { HobbyForm, HobbyList } from '@components';
import { Hobby } from '@models';
import { store } from '@store';
import './styles/main.scss';

async function main(): Promise<void> {
    initiateStore();

    customElements.define('hobby-form', HobbyForm);
    customElements.define('hobby-list', HobbyList);

    await customElements.whenDefined('hobby-form');
    await customElements.whenDefined('hobby-list');

    addEventListener('hobby:create', handleHobbyCreate);
}

function initiateStore(): void {
    store.append(new Hobby('own-hobby-1'));
    store.append(new Hobby('own-hobby-2'));
    store.append(new Hobby('own-hobby-3'));
    store.append(new Hobby('own-hobby-4'));
    store.append(new Hobby('own-hobby-5'));
    store.append(new Hobby('own-hobby-6'));
}

function handleHobbyCreate(e: CustomEvent): void {
    store.append(e.detail.data);
}

addEventListener('load', main);
