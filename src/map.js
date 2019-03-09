import { FOV, Map, RNG } from "./dun";

import { Colors } from "./datafiles";
import Game from "./game";
import { random } from "./lang";

const tile = function(spec) {
    let x = spec.x;
    let y = spec.y;
    let block = spec.blocking;
    let expl = spec.explored;
    let ch = spec.ch;
    let col = spec.col;

    let getCh = function() {
        if (typeof ch !== "undefined") {
            return ch;
        }
        return isBlocking() ? "#" : ".";
    };

    let setCh = function(char) {
        ch = char;
    };

    let getColor = function() {
        if (col) {
            return col;
        }
        return getCh() === "#" ? Colors.wall : Colors.floor;
    };

    let setColor = function(color) {
        col = color;
    };

    let setExplored = function(explored) {
        expl = explored;
    };

    let isExplored = function() {
        return expl;
    };

    let isBlocking = function() {
        return block;
    };

    let setBlocking = function(blocking) {
        block = blocking;
    };

    let getPos = function() {
        return { x: x, y: y };
    };

    let setPos = function(pos) {
        if (!pos) {
            return;
        }

        x = pos.x;
        y = pos.y;
    };

    let draw = function() {
        if (expl) {
            let color = getColor();
            Game.display.draw(x, y, getCh(), color, "#000");
        } else {
            Game.display.draw(x, y, " ");
        }
    };

    return Object.freeze({
        getPos,
        setPos,
        isBlocking,
        setBlocking,
        isExplored,
        setExplored,
        getColor,
        setColor,
        getCh,
        setCh,
        draw
    });
};

const tileMap = function(width, height) {
    "use strict";
    let w = width;
    let h = height;
    let tiles = [];

    let getTiles = function() {
        return tiles;
    };

    let isPosOnMap = function(x, y) {
        if (x < 0 || x >= width) {
            return false;
        }

        return y >= 0 && y <= height;
    };

    let getTile = pos => {
        return tiles.find(el => {
            return el.getPos().x === pos.x && el.getPos().y === pos.y;
        });
    };

    let getRandomTile = function() {
        return random(tiles);
    };

    let createStaircase = function(freeCells, direction, color) {
        let index = Math.floor(RNG.getUniform() * freeCells.length);
        let staircase = freeCells[index];
        staircase.setCh(direction);
        staircase.setColor(color);
        return staircase;
    };

    let generate = function() {
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let wall = tile({
                    x: x,
                    y: y,
                    blocking: true,
                    explored: false
                });
                tiles.push(wall);
            }
        }

        let digger = new Map.Digger();
        let digCallback = function(x, y, value) {
            let tileAt = getTile({ x: x, y: y });
            tileAt.setBlocking(value);
            tileAt.setExplored(false);
        };

        digger.create(digCallback.bind(this));
    };

    let getFreeCells = function() {
        return tiles.filter(function(elem) {
            return !elem.isBlocking();
        });
    };

    /* input callback */
    let lightPasses = function(x, y) {
        let tileAt = getTile({ x: x, y: y });
        return tileAt && tileAt.getCh() === ".";
    };

    let fov = new FOV.PreciseShadowcasting(lightPasses);

    let computeFov = function(pos) {
        /* output callback */
        fov.compute(pos.x, pos.y, 10, function(x, y, r, visibility) {
            if (visibility) {
                let tileAt = getTile({ x: x, y: y });
                if (tileAt && !tileAt.isExplored()) {
                    tileAt.setExplored(true);
                }

                let monsterAt = Game.level.getActorAt(tileAt);
                if (monsterAt) {
                    Game.scheduler.add(monsterAt);
                }
            }
        });
    };

    let draw = () => {
        for (const tile of tiles) {
            tile.draw();
        }
    };

    return Object.freeze({
        getTiles,
        isPosOnMap,
        getTile,
        getRandomTile,
        createStaircase,
        generate,
        getFreeCells,
        lightPasses,
        computeFov,
        draw
    });
};

export { tile, tileMap };
