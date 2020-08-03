import { Item } from "./Item";
import { ItemTemplate } from "./Actor";

export interface Weapon {
    power: number;
}

export interface Modifier {
    value: number;
}

export class Weapon extends Item {
    power: number;
    constructor(spec: ItemTemplate) {
        super(spec);
        this.power = spec.power;
    }

    public getPower(): number {
        return this.power;
    }
}
