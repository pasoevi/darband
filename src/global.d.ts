// import 'jest-extended';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type temporaryAny = any;

declare module '*.png' {
    const value: temporaryAny;
    export default value;
}
