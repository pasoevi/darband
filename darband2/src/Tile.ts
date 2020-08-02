import { Game } from "./Game";

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
