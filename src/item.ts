import { Actor } from "./actor";
import { ActorType } from "./datafiles";

export class Item{
    private type: ActorType;
    constructor(spec: Item) {
        this.type = spec.ActorType.ITEM;
    };
}