import { Message, dbg } from "./message";

import { Colors } from "./datafiles";
import Game from "./game";

const inventory = () => {
    const inventory = {
        weapon: {
            power: 10
        },
        activeItems: [],
        backpack: []
    };

    inventory.putInBackpack = (item) => {
        inventory.backpack.push(item);
    };

    return Object.freeze(inventory);
};

const AI = function(spec) {
    let { quests, moveCount, skills, xp, xpLevel } = spec;

    let addQuest = function(quest) {
        if (Array.isArray(quests)) {
            quests.push(quest);
        }
    };

    let getSkills = function() {
        return skills;
    };

    let getXp = function() {
        return xp;
    };

    let getXpLevel = function() {
        return xpLevel;
    };

    return Object.freeze({
        quests,
        moveCount,
        addQuest,
        getSkills,
        getXp,
        getXpLevel
    });
};

const Life = function(spec, actor) {
    let life = {
        hp: spec.hp,
        maxHp: spec.maxHp,
        defence: spec.defence,
        corpseName: spec.corpseName
    };

    life.die = function() {
        life.hp = 0;
        Message(`${actor.getName()} dies`);
        Game.scheduler.remove(actor);
    };

    life.isAlive = function() {
        return life.hp > 0;
    };

    /**
     * Take value damage from dealer, i.e subtract value from the dealer.
     * @param dealer
     * @param weapon - null means barehanded attack
     * @param value - hp to subtract
     * @param modifiers
     * @return {number} actual damage taken.
     */
    life.takeDamage = function(dealer, weapon, value, modifiers) {
        let damageTaken = value;

        if (!dealer || !life.isAlive()) {
            return damageTaken;
        }

        if (weapon) {
            damageTaken = weapon.power - life.defence;
        }

        damageTaken = modifiers.reduce(
            (prev, current) => prev + current.power,
            damageTaken
        );

        Message(`${life.hp} was and now is ${damageTaken} less`);
        Message(
            `${dealer.getName()} attacks ${actor.getName()} for ${damageTaken} hp`,
            Colors.red
        );

        if (life.hp - damageTaken > 0) {
            life.hp -= damageTaken;
        } else {
            life.die();
        }

        return damageTaken;
    };

    return life;
};

/**
 * Any object that can be located on the map, that has position, and
 * can be drawn.
 *
 * Examples: monsters, items you can pick (potions, weapons, etc.)
 * other items on the map - staircases, fountains, altars, etc.
 *
 * Player and all monsters inherit from this prototype.
 * @param spec
 * @constructor
 */
const Actor = function(spec) {
    let { x, y, speed, name, col, ch } = spec;

    const getPos = function() {
        return { x: x, y: y };
    };

    const setPos = function(pos) {
        if (!Game.level.map.isPosOnMap(pos.x, pos.y)) {
            dbg("Not on map");
            return;
        }

        x = pos.x;
        y = pos.y;
        Game.level.map.computeFov(pos);
    };

    const getName = () => name;

    let actor = {
        getName,
        getPos,
        setPos,
        speed
    };

    actor.inventory = inventory();

    actor.pickItem = (item) => {
        if (typeof actor.inventory === "undefined" || typeof item === "undefined") {
            return;
        }

        actor.inventory.putInBackpack(item);
    };

    const lifeTemplate =
        spec.lifeTemplate || (spec.race && spec.race.lifeTemplate);

    if (lifeTemplate) {
        actor.life = Life(lifeTemplate, actor);
    }

    if (spec.aiTemplate) {
        actor.ai = AI(spec.aiTemplate);
    }

    if (spec.pickableTemplate) {
        actor.ai = spec.pickableTemplate;
    }

    actor.draw = function() {
        if (actor.life !== undefined && actor.life.isAlive()) {
            Game.display.draw(x, y, ch, col, Colors.black);
        } else {
            Game.display.draw(x, y, ch, Colors.gold_yellow, Colors.black);
        }
    };

    return Object.freeze(actor);
};

export { Actor };
