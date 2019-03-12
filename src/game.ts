import { Classes, Levels, Settings, Texts } from "./datafiles";
import { Display, Engine, Scheduler } from "./dun";

import { makeLevel, Level } from "./level";
import { Message } from "./message";
import { Player } from "./player";
import { random } from "./lang";

export class Game {
    public display: Display;
    public logDisplay: Display;
    public scheduler: Scheduler;
    public engine: Engine;
    public level: Level;
    player: null;
    log: [];

    constructor() {
        this.log = [];
        this.scheduler = new Scheduler.Simple();
        this.level = new Level(Levels[Settings.game.startLevel]);

        this.display = new Display({
            width: Settings.windowW,
            height: Settings.windowH - 3
        });

        this.logDisplay = new Display({
            width: Settings.windowW,
            height: Settings.logLength
        });

        this.engine = new Engine(this.scheduler);
    }

    private initDisplay() {
        let gameDiv = document.getElementById("darband_game");
        if (gameDiv) {
            gameDiv.appendChild(this.display.getContainer());
            gameDiv.appendChild(this.logDisplay.getContainer());
        } else {
            console.log("Game div not found");
        }
    }

    private printWelcomeMsg() {
        Message(random(Texts.en.quotes));
    }

    public init() {
        this.initDisplay();
        let freeCells = this.level.getFreeCells();
        this.player = this.level.createBeing(
            Player,
            freeCells,
            random(Classes),
            true
        );
        this.level.draw();

        this.printWelcomeMsg();
        this.engine.start();
    }

    public switchLevel(level: Level) {
        /* remove old beings from the scheduler */
        this.scheduler.clear();
        this.scheduler.add(this.player, true);

        let newLevel = new Level(level);
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