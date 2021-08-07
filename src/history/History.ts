import { Message } from '../lib/Interfaces';

export class History {
    private messages: Message[] = [];

    public push(message: Message): void {
        this.messages.push(message);
    }
}