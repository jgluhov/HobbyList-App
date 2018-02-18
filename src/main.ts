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
    store.create(new Hobby('own-hobby-1'));
    store.create(new Hobby('own-hobby-2'));
    store.create(new Hobby('own-hobby-3'));
    store.create(new Hobby('own-hobby-4'));
    store.create(new Hobby('own-hobby-5'));
    store.create(new Hobby('own-hobby-6'));
    store.create(new Hobby('own-hobby-7'));
    store.create(new Hobby('own-hobby-8'));
    store.create(new Hobby('own-hobby-9'));
    store.create(new Hobby('own-hobby-10'));
}

function handleHobbyCreate(e: CustomEvent): void {
    store.create(e.detail.data);
}

addEventListener('load', main);
