import { Classes, Levels, Settings, Texts } from "./datafiles";
import { Display, Engine, Scheduler } from "./dun";

import { Level, ILevel } from "./level";
import { msg, Message } from "./message";
import { Player } from "./player";
import { random } from "./lang";

export class Game {
    public display: any;
    public logDisplay: any;
    public scheduler: any;
    public engine: any;
    public level: any;
    public player: any;
    public log: Message[];

    private static game: Game;

    public static getSingleton() {
        if (!this.game) {
            this.game = new Game();
        }

        return this.game;
    }

    private constructor() {
        this.level = null;
        this.player = null;
        this.log = [];
        this.scheduler = new Scheduler.Simple();

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
            const gameContainer = this.display.getContainer();
            const logContainer = this.logDisplay.getContainer();
            if (gameContainer && logContainer) {
                gameDiv.appendChild(gameContainer);
                gameDiv.appendChild(logContainer);
            }
        } else {
            console.log("Game div not found");
        }
    }

    private printWelcomeMsg() {
        msg(Game.getSingleton(), random(Texts.en.quotes));
    }

    public init() {
        this.level = new Level(Levels[Settings.game.startLevel]);
        const freeCells = this.level.getFreeCells();
        this.player = this.level.createBeing(
            Player,
            freeCells,
            random(Classes),
            true
        );
        this.initDisplay();
        this.level.map.computeFov(this.player.getPos());
        this.level.draw();

        this.printWelcomeMsg();
        this.engine.start();
    }

    public switchLevel(level: ILevel) {
        /* remove old beings from the scheduler */
        this.scheduler.clear();
        this.scheduler.add(this.player, true);

        let newLevel = new Level(level);
        if (!newLevel) {
            return;
        }

        if (this.player === null) {
            return;
        }

        let newPos = random(newLevel.getFreeCells(), (elem) =>  elem.getCh() === "<").getPos();

        const actionName = level.levelID > this.level.levelID ? "descend" : "ascend";
        this.level = newLevel;

        this.player.setPos(newPos);
        this.level.map.computeFov(newPos);
        this.level.draw();

        msg(Game.getSingleton(), `You ${actionName} into the level ${level.levelID} of ${level.domain}`);
    }
}