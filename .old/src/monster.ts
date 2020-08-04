import { Actor, ActorTemplate } from "./actor";
import { Game } from "./game";
import { Path } from "./dun";

export class Monster extends Actor {
    constructor(spec: ActorTemplate) {
        super(spec);
        this.game = Game.getSingleton();
    }

    public hasInventory() {
        return typeof this.inventory !== "undefined";
    }

    public act() {
        if (
            !this.life ||
            !this.life.isAlive() ||
            !this.game ||
            !this.game.player
        ) {
            return;
        }
        let map = this.game.getLevel().map;
        let playerPos = this.game.player.getPos();

        let passableCallback = (x: number, y: number) => {
            let tile = map.getTile({ x: x, y: y });
            if (tile) {
                !tile.isBlocking();
            }
            return true;
        };

        let astar = new Path.AStar(playerPos.x, playerPos.y, passableCallback, {
            topology: 4,
        });

        let path: number[][] = [];
        let pathCallback = (x: number, y: number) => {
            path.push([x, y]);
        };
        const position = this.getPos();
        if (position) {
            astar.compute(position.x, position.y, pathCallback);
        }

        path.shift();
        if (path.length === 1) {
            const inventory = this.getInventory();
            const weapon = inventory ? inventory.getCurrentWeapon() : undefined;

            this.game.player.life.takeDamage(this, 10, [], weapon);
            // call attack
        } else if (path.length > 1) {
            const newPos = {
                x: path[0][0],
                y: path[0][1],
            };
            this.setPos(newPos);
        }
    }
}
