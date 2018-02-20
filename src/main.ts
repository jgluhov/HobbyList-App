/**
 * HobbyForm Main
 */
import { HobbyForm, HobbyList } from '@components';
import { Belonging, Hobby } from '@models';
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
    Store._initiate([
        new Hobby('own-hobby-1'),
        new Hobby('own-hobby-2'),
        new Hobby('own-hobby-3'),
        new Hobby('own-hobby-4'),
        new Hobby('own-hobby-5'),
        new Hobby('own-hobby-6'),
        new Hobby('own-hobby-7'),
        new Hobby('own-hobby-8'),
        new Hobby('own-hobby-9'),
        new Hobby('own-hobby-10'),
        new Hobby('friend-hobby-1', Belonging.FRIEND),
        new Hobby('friend-hobby-2', Belonging.FRIEND),
        new Hobby('friend-hobby-3', Belonging.FRIEND),
        new Hobby('friend-hobby-4', Belonging.FRIEND),
        new Hobby('friend-hobby-5', Belonging.FRIEND),
        new Hobby('friend-hobby-6', Belonging.FRIEND),
        new Hobby('friend-hobby-7', Belonging.FRIEND),
        new Hobby('friend-hobby-8', Belonging.FRIEND),
        new Hobby('friend-hobby-9', Belonging.FRIEND),
        new Hobby('friend-hobby-10', Belonging.FRIEND),
        new Hobby('friend-hobby-11', Belonging.FRIEND),
        new Hobby('friend-hobby-12', Belonging.FRIEND)
    ]);
}

function handleHobbyCreate(e: CustomEvent): void {
    Store.create(e.detail.data);
}

addEventListener('load', main);
