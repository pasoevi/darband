import { Actor, Inventory, ActorTemplate } from "./actor";
import { Game } from "./Game";
import { Path } from "./dun";

export class Monster extends Actor {

    constructor(spec: ActorTemplate) {
        super(spec);
        this.game = Game.getSingleton();
    }

    public hasInventory(){
        return typeof this.inventory !== "undefined";
    };

    public act () {
        if (!this.life || !this.life.isAlive() || !this.game || !this.game.player) {
            return;
        }
        let map = this.game.level.map;
        let playerPos = this.game.player.getPos();


        let passableCallback = function (x: number, y: number) {
            let tile = map.getTile({x: x, y: y});
            if (tile) {
                !tile.isBlocking();
            }
            return false;
        };

        let astar = new Path.AStar(
            playerPos.x,
            playerPos.y,
            passableCallback,
            {topology: 4}
        );

        let path: any;
        let pathCallback = function (x: number, y: number) {
            path.push([x, y]);
        };
        astar.compute(this.getPos().x, this.getPos().y, pathCallback);

        path.shift();
        if (path.length === 1) {
            const inventory = this.getInventory();
            const weapon = inventory? inventory.getCurrentWeapon(): undefined;

            this.game.player.life.takeDamage(
                this,
                10,
                [],
                weapon,
            );
            // call attack
        } else if (path.length > 1) {
            let newX = path[0][0];
            let newY = path[0][1];
            this.setPos({x: newX, y: newY});
        }
    };
}