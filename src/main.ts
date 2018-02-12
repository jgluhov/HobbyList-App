/**
 * HobbyForm Main
 */
import { HobbyForm } from './components/hobby-form';
import './styles/main.scss';

customElements.define('hobby-form', HobbyForm);
async function main(): Promise<void> {
    await customElements.whenDefined('hobby-form');
}

main();
