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