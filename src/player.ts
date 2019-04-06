import { Actor, ActorTemplate, Inventory, LifeTemplate, Life } from "./actor";
import { DIRS } from "./dun";
import { Game } from "./Game";
import { msg } from "./message";
import { Staircase } from "./level";
import { random } from "./lang";
import { WizardLife } from "./datafiles";

export class Player extends Actor{
    public life: Life;

    constructor(spec: ActorTemplate) {
        super(spec);
        this.inventory = new Inventory();
        this.life = new Life(spec.lifeTemplate ? spec.lifeTemplate : WizardLife, this);
    }

    // Attach keydown listener.
    public act() {
        this.game.engine.lock();
        window.addEventListener("keydown", this);
    };

    // When invoked on a staircase or similar location, moves to that domain.
    public climb(direction: Staircase) {
        let tileMap = this.game.level.map;
        let tile = tileMap.getTile(this.getPos());
        if (tile && direction === tile.getCh()) {
            const nextLevel = this.game.level.getNextLevel(direction);
            if (nextLevel) {
                this.game.switchLevel(nextLevel);
            }
        } else {
            msg(this.game, `You cannot climb ${direction === ">" ? "down" : "up"} here`);
        }
    };

    private handlePickItem = () => {
        const pos = this.getPos();

        if (typeof pos === "undefined" || typeof this.inventory === "undefined") {
            msg(this.game, "Nothing to pick up");
            return;
        }

        const item = random(this.game.level.getItems());

        this.inventory.pickItem(item);
    };

    private moveOrAttack(dir: number[]) {
        // is there free space?
        const newX = this.getPos().x + dir[0];
        const newY = this.getPos().y + dir[1];
        const newPos = {x: newX, y: newY};

        const map = this.game.level.map;
        const newTile = map.getTile(newPos);
        if (!newTile || newTile.isBlocking()) {
            return;
        }

        const monster = this.game.level.getActorAt(newTile);

        if (monster && monster.life && monster.life.isAlive()) {
            const inventory = this.getInventory();
            const weapon = inventory && inventory.getCurrentWeapon()
            monster.life.takeDamage(this, 10, [], weapon);
        } else {
            this.setPos({x: newX, y: newY});
        }
    };

    public handleEvent(e: KeyboardEvent) {
        let code = e.keyCode;
        let keyMap: any = {};
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
            msg(this.game, "Nothing much yet");
        } else if (code === 71) {
            this.handlePickItem();
        } else if (code === 188) {
            this.climb("<");
        } else if (code === 190) {
            this.climb(">");
        } else if (keyMap[code] !== undefined) { // one of numpad directions?
            const direction = keyMap[code];
            let dir = DIRS[8][direction];
            this.moveOrAttack(dir);
        } else {
            return;
        }

        this.game.level.map.computeFov(this.getPos());
        this.game.level.draw();
        this.draw();

        window.removeEventListener("keydown", this);
        this.game.engine.unlock();
    }
}