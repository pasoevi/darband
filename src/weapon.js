const weapon = function (spec) {
    let {power} = spec;

    let getPower = function () {
        return power;
    };

    return Object.freeze({
        getPower
    });
};

const modifier = function (spec) {
    let {power} = spec;

    let getPower = function () {
        return power;
    };

    return Object.freeze({
        getPower
    });

};

export {
    weapon,
    modifier
};
