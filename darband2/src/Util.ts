export function randomRange(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const flatten = function (arr: Array<any>, result = []): Array<any> {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i];
        if (Array.isArray(value)) {
            flatten(value, result);
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
    throw "Timeout while trying to " + description;
}

export function shuffle(arr: Array<any>) {
    let temp, r;
    for (let i = 1; i < arr.length; i++) {
        r = randomRange(0, i);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
}
