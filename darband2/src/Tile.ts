import { Game } from "./Game";
import { shuffle } from "./Util";
import { Actor } from "./Actor";

export class Tile {
    private game: Game;
    constructor(
        public x: number,
        public y: number,
        public sprite: number,
        public passable: boolean,
    ) {
        this.game = Game.getInstance();
    }

    public draw(): void {
        this.game.renderer.drawSprite(this.sprite, this.x, this.y);
    }

    public getActorOnThis(): Actor[] {
        return this.game.monsters.filter(
            (a: Actor) => a.x === this.x && a.y === this.y,
        );
    }

    public getNeighbor(dx: number, dy: number): Tile {
        return this.game.getTile(this.x + dx, this.y + dy);
    }

    public getAdjacentNeighbors(): Array<Tile> {
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
        ]);
    }

    getAdjacentPassableNeighbors() {
        return this.getAdjacentNeighbors().filter((t) => t.passable);
    }

    getConnectedTiles() {
        let connectedTiles: Array<Tile> = [this];
        let frontier: Array<Tile> = [this];
        while (frontier.length) {
            const neighbors = frontier
                .pop()
                ?.getAdjacentPassableNeighbors()
                .filter((t: Tile) => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors ?? []);
            frontier = frontier.concat(neighbors ?? []);
        }
        return connectedTiles;
    }
}

export class Floor extends Tile {
    constructor(public x: number, public y: number) {
        super(x, y, 2, true);
    }
}

export class Wall extends Tile {
    constructor(public x: number, public y: number) {
        super(x, y, 3, false);
    }
}
