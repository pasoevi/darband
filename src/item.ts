import { Actor, ActorTemplate } from "./actor";
import { ActorType } from "./datafiles";

export class Item extends Actor{
    constructor(spec: ActorTemplate) {
        super(spec);
    };
}