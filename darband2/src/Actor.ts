import { Game } from "./Game";

export class Actor {
    name: string;
    tile: number;
    x: number;
    y: number;
    game: Game = undefined;

    constructor(name: string, tile: number, x: number, y: number) {
        this.game = Game.getInstance();
        this.name = name;
        this.tile = tile;
        this.x = x;
        this.y = y;
    }

    getName(): string {
        return this.name;
    }

    draw(): void {
        console.log(`${this.name}: ${this.tile}`);
        this.game.renderer.drawSprite(this.tile, this.x, this.y);
    }
}
