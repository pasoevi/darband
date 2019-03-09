import { Actor } from "./actor";
import { ActorType } from "./datafiles";

let Item = function (spec) {
    let item = Actor(spec);
    return Object.freeze(Object.assign(item, {
        type: ActorType.ITEM
    }));
};

export {
    Item
};