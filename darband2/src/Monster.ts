import { Actor, ActorTemplate } from "./Actor";
import { SimpleLife } from "./Data";

export class Monster extends Actor {
    constructor(spec: ActorTemplate) {
        super({ ...spec, lifeTemplate: SimpleLife });
    }
}

export class RedBug extends Monster {
    constructor(spec: ActorTemplate) {
        super(spec);
    }
}
