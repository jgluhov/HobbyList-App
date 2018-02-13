import { Hobby } from "@models";

declare module '*.html' {
    const value: string;
    export default value;
}

declare module '*.scss' {
    const value: string;
    export default value;
}

interface CustomEventInit {
    composed: true
}

interface WindowStore extends Window {
    __data__: Hobby[]
}