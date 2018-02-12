/**
 * HobbyForm Main
 */
import { HobbyForm } from './components/hobby-form';
import { Hobby } from '@models';
import './styles/main.scss';

async function main(): Promise<void> {
    customElements.define('hobby-form', HobbyForm);

    await customElements.whenDefined('hobby-form');

    document.addEventListener('hobby:create', handleHobbyCreate);
}

function handleHobbyCreate(hobby: Hobby): void {

}

window.addEventListener('load', main);
