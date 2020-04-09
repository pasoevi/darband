import { Game } from "./game";
import { Settings, Colors } from "./datafiles";

export function msg(game: Game, text: string, color?: string) {
    const tmpMsg = new Message(text, color);
    tmpMsg.print();
    game.log.push(tmpMsg);
}
export class Message {
    private game: Game;
    private text: string;
    private color: string;

    constructor(text: string, color = Colors.white) {
        this.game = Game.getSingleton();
        this.text = text;
        this.color = color;
    }

    public print() {
        this.game.logDisplay.clear();
        let i = 0;
        for (let msg of this.game.log.slice(-Settings.logHeight)) {
            this.game.logDisplay.draw(Settings.msg.x, Settings.msg.y + i, " ");
            this.game.logDisplay.drawText(Settings.msg.x, Settings.msg.y + i, `%c{${msg.color}}${msg.text}%c{}`);
            i += 1;
        }
    }
}

export function dbg (text: string) {
    console.log(text);
}
