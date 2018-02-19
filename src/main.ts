/**
 * HobbyForm Main
 */
import { HobbyForm, HobbyList } from '@components';
import { Hobby } from '@models';
import { Store } from '@store';
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
    Store.create(new Hobby('own-hobby-1'));
    Store.create(new Hobby('own-hobby-2'));
    Store.create(new Hobby('own-hobby-3'));
    Store.create(new Hobby('own-hobby-4'));
    Store.create(new Hobby('own-hobby-5'));
    Store.create(new Hobby('own-hobby-6'));
    Store.create(new Hobby('own-hobby-7'));
    Store.create(new Hobby('own-hobby-8'));
    Store.create(new Hobby('own-hobby-9'));
    Store.create(new Hobby('own-hobby-10'));
}

function handleHobbyCreate(e: CustomEvent): void {
    Store.create(e.detail.data);
}

addEventListener('load', main);
