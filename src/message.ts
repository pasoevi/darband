import { Game } from "./game";
import { Settings, Colors } from "./datafiles";

const game = new Game();

export function msg(text: string, color?: string) {
    const tmpMsg = new Message(text, color);
    tmpMsg.print();
    game.log.push(tmpMsg);
}
export class Message {
    private text: string;
    private color: string;

    constructor(text: string, color = Colors.white) {
        this.text = text;
        this.color = color;
    }

    public print() {
        game.logDisplay.clear();
        let i = 0;
        for (let msg of game.log.slice(-Settings.logLength)) {
            game.logDisplay.draw(Settings.msg.x, Settings.msg.y + i, " ");
            game.logDisplay.drawText(Settings.msg.x, Settings.msg.y + i, `%c{${msg.color}}${msg.text}%c{}`);
            i += 1;
        }
    }
}

export function dbg (text: string) {
    console.debug(text);
}