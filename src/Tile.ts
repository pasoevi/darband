import { Actor } from "./Actor";
import { Game } from "./Game";
import { shuffle } from "./Util";

export class Tile {
    private game: Game;

    constructor(
        public x: number,
        public y: number,
        public sprite = 0,
        public passable = true,
        public monster: Actor | null = null,
    ) {
        this.game = Game.getInstance();
    }

    public draw(): void {
        this.game.renderer.drawSprite(this.sprite, this.x, this.y);
    }

    public getActorsOnThis(): Actor[] {
        return this.game.monsters.filter(
            (a: Actor) => a.tile.x === this.x && a.tile.y === this.y,
        );
    }

    public getNeighbor(dx: number, dy: number): Tile {
        return this.game.getTile(this.x + dx, this.y + dy);
    }

    public getAdjacentNeighbors(): Array<Tile> {
        return shuffle<Tile>([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0),
        ]);
    }

    getAdjacentActors<T extends Actor>(): Array<T> {
        return (
            this.getAdjacentNeighbors()
                .filter((t) => t.monster !== null)
                // TODO: Return not only monsters
                .map((t) => t.monster as T)
        );
    }

    distance(other: Tile): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    getAdjacentPassableTiles(): Array<Tile> {
        return this.getAdjacentNeighbors().filter((t) => t.passable);
    }

    getConnectedTiles(): Array<Tile> {
        let connectedTiles: Array<Tile> = [this];
        let frontier: Array<Tile> = [this];
        while (frontier.length) {
            const neighbors = frontier
                .pop()
                ?.getAdjacentPassableTiles()
                .filter((t: Tile) => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors ?? []);
            frontier = frontier.concat(neighbors ?? []);
        }
        return connectedTiles;
    }

    replace(newTileType: typeof Tile): Tile {
        // TODO: copy over monsters and items from the old tile to the new if necessary
        this.game.tiles[this.x][this.y] = new newTileType(this.x, this.y);
        return this.game.tiles[this.x][this.y];
    }
}

export class Floor extends Tile {
    constructor(public x: number, public y: number) {
        super(x, y, 32, true);
    }
}

export class Wall extends Tile {
    constructor(public x: number, public y: number) {
        super(x, y, 33, false);
    }
}
