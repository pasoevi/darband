import { Actor } from "./Actor";
import { Tile } from "./Tile";

export class Item extends Actor {
    constructor(name: string, sprite: number, tile: Tile) {
        super(name, tile, sprite);
    }
}
