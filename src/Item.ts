import { Actor } from "./Actor";
import { Tile } from "./Tile";

export class Item extends Actor {
    public constructor(name: string, sprite: number, tile: Tile) {
        super(name, tile, sprite);
    }
}
