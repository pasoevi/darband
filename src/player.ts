import { Actor } from "./actor";
import { DIRS } from "./dun";
import { Game } from "./game";
import { Message } from "./message";

class Player extends Actor{
    private game: Game;

    constructor(game: Game, spec: Being) {
        super(spec);
        this.game = game;
    }

    // Attach keydown listener.
    public act() {
        this.game.engine.lock();
        window.addEventListener("keydown", this);
    };

    // When invoked on a staircase or similar location, moves to that domain.
    public climb(direction: string) {
        let tileMap = this.game.level.map;
        let tile = tileMap.getTile(this.getPos());
        if (direction === tile.getCh()) {
            this.game.switchLevel(this.game.level.getNextLevel(tile.getCh()));
        } else {
            Message(`You cannot climb ${direction === ">" ? "down" : "up"} here`);
        }
    };

    private handlePickItem = () => {
        const item = this.getPos();

        if (typeof item === "undefined") {
            Message("Nothing to pick up");
        }
        this.pickItem(item);
    };

    const moveOrAttack = function(dir) {
        // is there a free space?
        const newX = getPos().x + dir[0];
        const newY = getPos().y + dir[1];
        const newPos = {x: newX, y: newY};

        const map = Game.level.map;
        const newTile = map.getTile(newPos);
        if (newTile.isBlocking()) {
            return;
        }

        const monster = Game.level.getActorAt(newTile);

        if (monster && monster.life.isAlive()) {
            monster.life.takeDamage(player, inventory.weapon, 10, []);
        } else {
            setPos({x: newX, y: newY});
        }
    };

    player.handleEvent = function (e) {
        let code = e.keyCode;
        let keyMap = {};
        keyMap[38] = 0;
        keyMap[33] = 1;
        keyMap[39] = 2;
        keyMap[34] = 3;
        keyMap[40] = 4;
        keyMap[35] = 5;
        keyMap[37] = 6;
        keyMap[36] = 7;


        if (code === 13 || code === 32) {
            // Enter key was pressed
            Message("Nothing much yet");
        } else if (code === 71) {
            handlePickItem();
        } else if (code === 188) {
            player.climb("<");
        } else if (code === 190) {
            player.climb(">");
        } else if (keyMap[code] !== undefined) { // one of numpad directions?
            let dir = DIRS[8][keyMap[code]];
            moveOrAttack(dir);
        } else {
            return;
        }

        Game.level.draw();

        window.removeEventListener("keydown", this);
        Game.engine.unlock();
    };

    Game.level.map.computeFov(getPos());

    return Object.freeze(player);
};

export {
    Player
};