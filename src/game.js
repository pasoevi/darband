import { Classes, Levels, Settings, Texts } from "./datafiles";
import { Display, Engine, Scheduler } from "./dun";

import { makeLevel } from "./level";
import { Message } from "./message";
import { Player } from "./player";
import { random } from "./lang";

export default {
    display: null,
    logDisplay: null,
    scheduler: null,
    engine: null,
    level: null,
    player: null,
    log: [],

    initDisplay: function () {
        this.display = new Display({
            width: Settings.windowW,
            height: Settings.windowH - 3
        });

        this.logDisplay = new Display({
            width: Settings.windowW,
            height: Settings.logLength
        });
        let gameDiv = document.getElementById("darband_game");
        gameDiv.appendChild(this.display.getContainer());
        gameDiv.appendChild(this.logDisplay.getContainer());
    },

    printWelcomeMsg: function () {
        Message(random(Texts.en.quotes));
    },

    init: function () {
        this.initDisplay();
        this.scheduler = new Scheduler.Simple();
        this.level = makeLevel(Levels[Settings.game.startLevel]);
        let freeCells = this.level.getFreeCells();
        this.player = this.level.createBeing(
            Player,
            freeCells,
            random(Classes),
            true
        );
        this.level.draw();

        this.printWelcomeMsg();

        this.engine = new Engine(this.scheduler);
        this.engine.start();
    },

    switchLevel: function (level) {
        /* remove old beings from the scheduler */
        this.scheduler.clear();
        this.scheduler.add(this.player, true);

        let newLevel = makeLevel(level);
        if (!newLevel) {
            return;
        }

        let newPos = random(newLevel.getFreeCells(), (elem) =>  elem.getCh() === "<").getPos();

        const actionName = level.levelID > this.level.levelID ? "descend" : "ascend";
        this.level = newLevel;

        this.player.setPos(newPos);
        this.level.map.computeFov(newPos);
        this.level.draw();

        Message(`You ${actionName} into the level ${level.levelID} of ${level.domain}`);
    }
};