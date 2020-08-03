import { Actor, ActorTemplate } from "./Actor";
import { SimpleLife } from "./Data";
import { Tile } from "./Tile";

export class Monster extends Actor {
    constructor(spec: ActorTemplate) {
        super({ ...spec, lifeTemplate: SimpleLife });
    }

    public update(): void {
        this.act();
    }

    public getAdjacentTiles(): Array<Tile> {
        return this.game.getTile(this.x, this.y).getAdjacentPassableTiles();
    }

    private act() {
        let neighbors = this.getAdjacentTiles();

        neighbors = neighbors.filter((t) => {
            const actors = t.getActorsOnThis();
            return (
                actors.length === 0 ||
                actors.filter((a) => a.isPlayer).length > 0
            );
        });

        if (neighbors.length) {
            const playerTile = this.game.player?.getTile();
            neighbors.sort(
                (a, b) => a.distance(playerTile) - b.distance(playerTile),
            );
            const newTile = neighbors[0];
            this.tryMove(
                newTile.x - this.getTile().x,
                newTile.y - this.getTile().y,
            );
        }
    }
}

export class RedBug extends Monster {
    constructor(spec: ActorTemplate) {
        super(spec);
    }
}

/* class Bird extends Monster {
    constructor(tile) {
        super(tile, 4, 3);
    }
}

class Snake extends Monster {
    constructor(tile) {
        super(tile, 5, 1);
    }
}

class Tank extends Monster {
    constructor(tile) {
        super(tile, 6, 2);
    }
}

class Eater extends Monster {
    constructor(tile) {
        super(tile, 7, 1);
    }
}

class Jester extends Monster {
    constructor(tile) {
        super(tile, 8, 2);
    }
}
 */
