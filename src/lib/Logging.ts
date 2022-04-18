import { LoggingLibrary } from './Interfaces';

/*
 * @experimental
 */
export class ConsoleLogging implements LoggingLibrary {
    public log(message: string): void {
        // eslint-disable-next-line no-console
        console.log(message);
    }
}
