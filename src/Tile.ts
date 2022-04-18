// eslint-disable-next-line max-classes-per-file
import { Actor } from './actor/Actor';
import { Game } from './Game';
import { Animation } from './lib/Interfaces';
import { Direction } from './Types';
import { shuffle } from './Util';

export interface TileFeature {
    onInteract: (actor: Actor) => void;
    skipOtherFeatures?: boolean;
}

export class Tile {
    public game: Game;

    public constructor(
        public x: number,
        public y: number,
        public sprite = 0,
        public passable = true,
        public monster: Actor | null = null,
        public animation?: Animation,
        public features: TileFeature[] = [],
    ) {
        this.game = Game.getInstance();
    }

    public draw(): void {
        const { renderer } = this.game;
        renderer.drawSprite(this.sprite, this.x, this.y, this.game.animation);

        if (this.animation && this.animation?.effectCounter > 0) {
            this.animation.effectCounter--;
            renderer.setGlobalAlpha(this.animation.effectCounter / 30);
            if (this.animation.effectSprite !== undefined) {
                renderer.drawSprite(this.animation.effectSprite, this.x, this.y);
            }
            renderer.resetGlobalAlpha();
        }
    }

    public setAnimationEffect(effectSprite: number): void {
        if (this.animation) {
            this.animation.effectSprite = effectSprite;
            this.animation.effectCounter = 30;
        }
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

    public getAdjacentActors<T extends Actor>(): Array<T> {
        return (
            this.getAdjacentNeighbors()
                .filter((t) => t.monster !== null)
                // TODO: Return not only monsters
                .map((t) => t.monster as T)
        );
    }

    public getAdjacentPassableTiles(): Array<Tile> {
        return this.getAdjacentNeighbors().filter((t) => t.passable);
    }

    public distance(other: Tile): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    public getConnectedTiles(): Array<Tile> {
        let connectedTiles: Array<Tile> = [this];
        let frontier: Array<Tile> = [this];
        while (frontier.length) {
            const neighbors = frontier
                .pop()
                ?.getAdjacentPassableTiles()
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                .filter((t) => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors ?? []);
            frontier = frontier.concat(neighbors ?? []);
        }
        return connectedTiles;
    }

    public replace(NewTileType: typeof Tile): Tile {
        // TODO: copy over monsters and items from the old tile to the new if necessary
        this.game.tiles[this.x][this.y] = new NewTileType(this.x, this.y);
        return this.game.tiles[this.x][this.y];
    }

    public interact(actor: Actor) {
        this.features.map((feature) => feature.onInteract(actor));
    }
}

export class Floor extends Tile {
    public constructor(x: number, y: number) {
        super(x, y, 32, true);
    }
}

export class Wall extends Tile {
    public constructor(x: number, y: number) {
        super(x, y, 33, false);
    }
}

export class Staircase extends Tile {
    public constructor(
        x: number,
        y: number,
        sprite: number,
        public direction: Direction,
    ) {
        super(x, y, sprite, true);
        this.features.push({
            onInteract: (actor) => this.climb(),
        });
    }

    public climb() {
        const nextLevel = this.game.levelID + (this.direction === 'UP' ? -1 : 1);
        this.game.startLevel(nextLevel);
    }
}

export class StaircaseUp extends Staircase {
    public constructor(x: number, y: number, sprite = 44) {
        super(x, y, sprite, 'UP');
    }
}

export class StaircaseDown extends Staircase {
    public constructor(x: number, y: number, sprite = 43) {
        super(x, y, sprite, 'DOWN');
    }
}
