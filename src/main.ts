/**
 * HobbyForm Main
 */
import { HobbyForm } from './components/hobby-form';
import './styles/main.scss';

async function main(): Promise<void> {
    customElements.define('hobby-form', HobbyForm);

    await customElements.whenDefined('hobby-form');
}

window.addEventListener('load', main);
