import { Item } from "./Item";
import { Tile } from "./Tile";

export interface Weapon {
    power: number;
}

export interface Modifier {
    value: number;
}

export class Weapon extends Item {
    public constructor(
        name: string,
        sprite: number,
        tile: Tile,
        public power: number,
    ) {
        super(name, sprite, tile);
        this.power = power;
    }

    public getPower(): number {
        return this.power;
    }
}
