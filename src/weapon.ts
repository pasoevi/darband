import { Item } from "./item";
import { ActorTemplate } from "./actor";

export interface Weapon {
    power: number;
}

export interface Modifier {
    value: number;
}

export class Weapon extends Item {
    power: number;
    constructor(spec = {power: 10}) {
        super(spec);
        this.power = spec.power;
    }

    public getPower () {
        return this.power;
    };
};