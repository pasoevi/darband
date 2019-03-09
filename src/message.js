import Game from "./game";
import { Settings, Colors } from "./datafiles";

export function Message (text, color = Colors.white) {
    const message = {
        text, color
    };

    Game.log.push(message);
    Game.logDisplay.clear();
    let i = 0;
    for (let msg of Game.log.slice(-Settings.logLength)) {
        Game.logDisplay.draw(Settings.msg.x, Settings.msg.y + i, " ");
        Game.logDisplay.drawText(Settings.msg.x, Settings.msg.y + i, `%c{${msg.color}}${msg.text}%c{}`);
        i += 1;
    }
}

export function dbg (text) {
    console.debug(text);
}