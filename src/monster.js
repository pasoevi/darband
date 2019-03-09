import { Actor } from "./actor";
import Game from "./game";
import { Path } from "./dun";

const Monster = function (spec) {
    let {
        getPos,
        setPos,
        draw,
        life,
        inventory,
        getName
    } = Actor(spec);

    let getInventory = function () {
        return inventory;
    };

    let hasInventory = function () {
        return inventory !== undefined;
    };

    let act = function () {
        if (!life.isAlive()) {
            return;
        }
        let map = Game.level.map;
        let playerPos = Game.player.getPos();

        let passableCallback = function (x, y) {
            let tile = map.getTile({x: x, y: y});
            return !tile.isBlocking();
        };

        let astar = new Path.AStar(
            playerPos.x,
            playerPos.y,
            passableCallback,
            {topology: 4}
        );

        let path = [];
        let pathCallback = function (x, y) {
            path.push([x, y]);
        };
        astar.compute(getPos().x, getPos().y, pathCallback);

        path.shift();
        if (path.length === 1) {
            Game.player.life.takeDamage(
                this,
                getInventory().weapon,
                10,
                []
            );
            // call attack
        } else if (path.length > 1) {
            let newX = path[0][0];
            let newY = path[0][1];
            setPos({x: newX, y: newY});
        }
    };

    return Object.freeze({
        getPos,
        setPos,
        getName,
        life,
        hasInventory,
        getInventory,
        act,
        draw
    });
};

export {
    Monster
};