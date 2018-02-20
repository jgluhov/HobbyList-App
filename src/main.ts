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
    Store._fill([
        new Hobby('Дабстеп'),
        new Hobby('саксофон'),
        new Hobby('классика'),
        new Hobby('рок'),
        new Hobby('боевики'),
        new Hobby('Сноуборд'),
        new Hobby('Компьтер'),
        new Hobby('Typescript'),
        new Hobby('Любовь'),
        new Hobby('Мечтать'),
        new Hobby('Fallout 3 OST', Belonging.FRIEND),
        new Hobby('Doom metal', Belonging.FRIEND)
    ]);
}

function handleHobbyCreate(e: CustomEvent): void {
    Store.post(e.detail.data);
}

addEventListener('load', main);
