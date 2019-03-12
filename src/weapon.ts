export interface Weapon {
    power: number;
}

export interface Modifier {
    value: number;
}

const weapon = function (spec: Weapon) {
    let {power} = spec;

    let getPower = function () {
        return power;
    };

    return Object.freeze({
        getPower
    });
};

export {
    weapon
};
