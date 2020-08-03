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

/* class Bird extends Monster {
    constructor(tile) {
        super(tile, 4, 3);
    }
}

class Snake extends Monster {
    constructor(tile) {
        super(tile, 5, 1);
    }
}

class Tank extends Monster {
    constructor(tile) {
        super(tile, 6, 2);
    }
}

class Eater extends Monster {
    constructor(tile) {
        super(tile, 7, 1);
    }
}

class Jester extends Monster {
    constructor(tile) {
        super(tile, 8, 2);
    }
}
 */
