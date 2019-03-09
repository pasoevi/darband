import { Items, Levels, Monsters, Settings, Colors } from "./datafiles";
import { Message } from "./message";

import Game from "./game";
import { Item } from "./item";
import { Monster } from "./monster";
import { RNG } from "./dun";
import { tileMap as makeTileMap } from "./map";

/**
 * A level is any area separated from the rest of the world by a
 * staircase, portal or other gateway.
 */
const makeLevel = function(level) {
    let map = makeTileMap(Settings.mapW, Settings.mapH);
    let monsters = [];
    let items = [];

    let getFreeCells = function() {
        return map.getFreeCells();
    };

    let createBeing = function(what, freeCells, spec, activate) {
        let index = Math.floor(RNG.getUniform() * freeCells.length);
        let cell = freeCells[index];
        spec.x = cell.getPos().x;
        spec.y = cell.getPos().y;
        let actor = what(spec);
        if (activate) {
            Game.scheduler.add(actor, true);
        }
        return actor;
    };

    /**
     * Put random monsters on map. Only monsters, items that have races that have
     * this dungeon as possible domain range will be generated.
     * @param map
     */
    let generateActors = function(map) {
        let freeCells = map.getFreeCells();

        let possibleMonsters = Monsters.filter(monster =>
            monster.race.domains.includes(level.levelID)
        );
        let possibleItems = Items.filter(item => item.domains.includes(level.levelID));

        possibleMonsters.forEach(spec => {
            let n = RNG.getUniformInt(0, 5);
            [...Array(n).keys()].forEach(() =>
                monsters.push(createBeing(Monster, freeCells, spec))
            );
        });

        possibleItems.forEach(spec => {
            let n = RNG.getUniformInt(0, 5);
            [...Array(n).keys()].forEach(() =>
                items.push(createBeing(Item, freeCells, spec))
            );
        });

        if (level.levelID !== Settings.game.winLevel) {
            map.createStaircase(getFreeCells(), "<", Colors.fire);
            map.createStaircase(getFreeCells(), ">", Colors.ice);
            map.createStaircase(getFreeCells(), ">", Colors.chaos);
            map.createStaircase(getFreeCells(), ">", Colors.magic);
            map.createStaircase(getFreeCells(), "<");
        }
    };

    let draw = function() {
        map.draw();
        const exploredActors = [...monsters, ...items].filter(x => {
            let tile = map.getTile(x.getPos());
            return tile.isExplored();
        });

        for (const actor of exploredActors) {
            actor.draw();
        }
        Game.player.draw();
    };

    let getActorAt = function(tl) {
        if (!tl) {
            return null;
        }

        let monster = monsters.find(function(mon) {
            return (
                mon.getPos().x === tl.getPos().x &&
                mon.getPos().y === tl.getPos().y
            );
        });

        return monster;
    };

    let getNextLevel = function(staircase) {
        const currentLevel = Levels.find(l => l.levelID === level.levelID);
        const nextLevelNumber =
            staircase === ">"
                ? currentLevel.levelID + 1
                : currentLevel.levelID - 1;

        if (nextLevelNumber === Settings.game.winLevel) {
            Message(
                `You win the game by reaching the level ${
                    Settings.game.winLevel
                }`
            );
        }

        let nextLevel = Levels.find(l => l.levelID === nextLevelNumber);
        if (nextLevel) {
            return nextLevel;
        }
        return null;
    };

    map.generate();
    generateActors(map);

    return Object.freeze({
        ...level,
        map,
        getFreeCells,
        draw,
        createBeing,
        getActorAt: getActorAt,
        getNextLevel
    });
};

export { makeLevel };
