export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const flatten = function <T>(
    arr: Array<Array<T>> | Array<T>,
    result: Array<T> = [],
): Array<T> {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i];
        if (Array.isArray(value)) {
            flatten<T>(value, result);
        } else {
            result.push(value);
        }
    }
    return result;
};

export function tryTo(description: string, callback: () => boolean): void {
    for (let timeout = 1000; timeout > 0; timeout--) {
        if (callback()) {
            return;
        }
    }
    throw 'Timeout while trying to ' + description;
}

export function shuffle<T>(arr: Array<T>): Array<T> {
    const newArray = arr.slice();
    let temp, r;
    for (let i = 1; i < newArray.length; i++) {
        r = randomRange(0, i);
        temp = newArray[i];
        newArray[i] = newArray[r];
        newArray[r] = temp;
    }
    return newArray;
}
