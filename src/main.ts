/**
 * HobbyForm Main
 */
import { HobbyForm, HobbyList } from '@components';
import { Belonging, Hobby } from '@models';
import { Store } from '@store';
import './styles/main.scss';

async function main(): Promise<void> {
    await initiateStore();

    customElements.define('hobby-form', HobbyForm);
    customElements.define('hobby-list', HobbyList);

    await customElements.whenDefined('hobby-form');
    await customElements.whenDefined('hobby-list');

    addEventListener('hobby:create', handleHobbyCreate);
}

async function initiateStore(): Promise<void> {
    await Store.create(new Hobby('own-hobby-1'));
    await Store.create(new Hobby('own-hobby-2'));
    await Store.create(new Hobby('own-hobby-3'));
    await Store.create(new Hobby('own-hobby-4'));
    await Store.create(new Hobby('own-hobby-5'));
    await Store.create(new Hobby('own-hobby-6'));
    await Store.create(new Hobby('own-hobby-7'));
    await Store.create(new Hobby('own-hobby-8'));
    await Store.create(new Hobby('own-hobby-9'));
    await Store.create(new Hobby('own-hobby-10'));

    await Store.create(new Hobby('friend-hobby-1', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-2', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-3', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-4', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-5', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-6', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-7', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-8', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-9', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-10', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-11', Belonging.FRIEND));
    await Store.create(new Hobby('friend-hobby-12', Belonging.FRIEND));
}

function handleHobbyCreate(e: CustomEvent): void {
    Store.create(e.detail.data);
}

addEventListener('load', main);
