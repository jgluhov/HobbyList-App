/**
 * HobbyForm | uuid
 */

export function uuid(): string {
    const array: Uint32Array = new Uint32Array(1);
    window.crypto.getRandomValues(array);

    return array.toString().replace(/[,]/, '');
}
