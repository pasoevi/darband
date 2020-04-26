import { RNG } from "./dun";

/**
 * Return a random element of the array that satisfies the
 * predicate. If no predicate given, return any random element.
 * @param predicate return a random element that satisfies this predicate.
 * @returns a random element or null if no element satisfied the given
 * predicate or the array is empty.
 */
export function random(collection: any[], predicate?: (elem: any) => boolean) {
    let validElems;

    if (!collection.length) {
        return null;
    }

    if (predicate) {
        validElems = collection.filter(predicate);
    } else {
        validElems = collection;
    }

    let randomItemKey = Math.floor(RNG.getUniform() * validElems.length);
    return validElems[randomItemKey];
}