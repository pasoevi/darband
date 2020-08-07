import { GameUI, RenderingLibrary } from "./lib/interfaces";
import {
    createMonster,
    Goblin,
    Kobold,
    Man,
    Monster,
    Snake,
    Wolf,
} from "./Monster";
import { Player } from "./player";
import { Floor, StaircaseDown, StaircaseUp, Tile, Wall } from "./Tile";
import { flatten, randomRange, tryTo } from "./Util";

export interface GameOptions {
    renderingLibrary: RenderingLibrary;
    ui: GameUI;
}

export type GameState = "LOADING" | "PLAYING" | "DEAD" | "TITLE";

export class Game {
    private static instance: Game;
    public renderer: RenderingLibrary;
    public ui: GameUI;
    public player = (null as unknown) as Player;
    public tiles: Array<Array<Tile>> = [];
    public monsters: Monster[] = [];
    // TODO: Use in getPossibleMonsters
    public levelID = 0;
    public maxLevelID = 16;
    public gameState: GameState = "TITLE";

    private constructor(options: GameOptions) {
        this.renderer = options.renderingLibrary;
        this.ui = options.ui;
        this.renderer.setOnRendererReady(() => {
            this.renderTitleScreen();
            this.render();
        });
    }

    public static getInstance(options?: GameOptions): Game {
        if (Game.instance === undefined) {
            if (options === undefined) {
                throw new Error(
                    "getInstance needs to be passed the parameters when called for the fist time",
                );
            }
            Game.instance = new Game(options);
        }
        return Game.instance;
    }

    public getRandomPassableTile(): Tile {
        return this.getRandomTile((t: Tile) => t.passable);
    }

    public getTiles(condition?: (tile: Tile) => boolean): Array<Tile> {
        const allTiles = flatten<Tile>(this.tiles);
        return condition === undefined ? allTiles : allTiles.filter(condition);
    }

    public getPassableTiles(): Array<Tile> {
        return this.getTiles((t: Tile) => t.passable);
    }

    public setupGame(): void {
        const html = document.querySelector("html");
        if (html === null) {
            throw Error("Please run the app in the browser environment");
        }
        html.onkeydown = (e) => {
            if (this.gameState === "TITLE") {
                this.startGame();
            } else if (this.gameState === "DEAD") {
                this.renderTitleScreen();
            } else if (this.gameState === "PLAYING") {
                if (this.player === undefined) {
                    return;
                }
                if (e.key === "w") {
                    this.player.tryMove(0, -1);
                }
                if (e.key === "s") {
                    this.player.tryMove(0, 1);
                }
                if (e.key === "a") {
                    this.player.tryMove(-1, 0);
                }
                if (e.key === "d") {
                    this.player.tryMove(1, 0);
                }
                if (e.key === "Enter") {
                    this.startLevel(this.levelID + 1);
                }

                // Monster movements (temporary feature)
                if (e.key == "ArrowUp") {
                    this.monsters[0].tryMove(0, -1);
                }
                if (e.key == "ArrowDown") {
                    this.monsters[0].tryMove(0, 1);
                }
                if (e.key == "ArrowLeft") {
                    this.monsters[0].tryMove(-1, 0);
                }
                if (e.key == "ArrowRight") {
                    this.monsters[0].tryMove(1, 0);
                }

                this.render();
            }
        };
    }

    private startGame(): void {
        this.gameState = "PLAYING";
        this.startLevel(0);
        this.render();
    }

    private startLevel(levelId: number) {
        this.levelID = levelId;
        this.generateLevel();
    }

    private generateLevel(): void {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ===
                this.getRandomPassableTile().getConnectedTiles().length
            );
        });

        const startingTile = this.getRandomPassableTile();
        this.player = new Player(startingTile);

        this.monsters = this.generateMonsters();

        if (this.levelID > 0) {
            this.getRandomPassableTile().replace(StaircaseUp);
            // stairsUp = new StaircaseUp(stairsUp.x, stairsUp.y);
            // this.tiles[stairsUp.x][stairsUp.y] = stairsUp;
        }

        if (this.levelID < this.maxLevelID) {
            const stairsDown = this.getRandomPassableTile().replace(
                StaircaseDown,
            );
            if (this.levelID === 0) {
                stairsDown.sprite = 42;
            }
            // stairsDown = new StaircaseDown(stairsDown.x, stairsDown.y, this.levelID === 0 ? 42 : undefined);
            // this.tiles[stairsDown.x][stairsDown.y] = stairsDown;
        }
    }

    /* TODO: Not fully implemented */
    private generateMonsters(): Monster[] {
        const monsters: Monster[] = [];
        /*
        TODO: Delete
        const allMonsters: {[key: string]: Monster} = {
            "goblin": Goblin,
            "kobold": Kobold,
            "orc": Orc,
            "dwarf": Dwarf,
            "man": Man,
            "troll": Troll,
            "elf": Elf,
            "dragon": Dragon,
            "snake": Snake,
        }; */
        const allMonsters = [
            [Wolf, Wolf, Man, Snake, Snake],
            [Kobold, Goblin],
        ];
        // const n = randomRange(2, 2);
        for (const monster of allMonsters[this.levelID]) {
            monsters.push(createMonster(monster));
        }
        /* for (let i = 0; i < n; i++) {
        } */
        return monsters;
    }

    private renderTiles(): void {
        const numTiles = this.renderer.options.numTiles;
        for (let i = 0; i < numTiles; i++) {
            for (let j = 0; j < numTiles; j++) {
                this.getTile(i, j).draw();
            }
        }
    }

    private renderMonsters(): void {
        for (const monster of this.monsters) {
            monster.draw();
        }
    }

    private generateTiles(): number {
        let passableTiles = 0;
        const tiles: Array<Array<Tile>> = [];
        const numTiles = this.renderer.options.numTiles;
        for (let i = 0; i < numTiles; i++) {
            tiles[i] = [];
            for (let j = 0; j < numTiles; j++) {
                if (Math.random() < 0.3 || !this.inBounds(i, j)) {
                    tiles[i][j] = new Wall(i, j);
                } else {
                    tiles[i][j] = new Floor(i, j);
                    passableTiles++;
                }
            }
        }

        this.tiles = tiles;
        return passableTiles;
    }

    public inBounds(x: number, y: number): boolean {
        const numTiles = this.renderer.options.numTiles;
        return x > 0 && y > 0 && x < numTiles - 1 && y < numTiles - 1;
    }

    public getTile(x: number, y: number): Tile {
        if (this.inBounds(x, y)) {
            return this.tiles[x][y];
        } else {
            return new Wall(x, y);
        }
    }

    public tick(): void {
        for (let k = this.monsters.length - 1; k >= 0; k--) {
            if (this.monsters[k].life?.isAlive()) {
                this.monsters[k].update();
            } else {
                this.monsters.splice(k, 1);
            }
        }

        if (!this.player.life.isAlive()) {
            this.gameState = "DEAD";
        }
    }

    public render(): void {
        if (this.gameState === "PLAYING" || this.gameState === "DEAD") {
            this.renderer.clearScreen();
            this.renderTiles();
            this.renderMonsters();
            this.player.draw();
            this.ui.render(this);
        }
    }

    private renderTitleScreen() {
        this.renderer.drawRect("rgba(0,0,0,.75)", 0, 0);
        this.gameState = "TITLE";

        // this.renderer.drawText("SUPER", 40, true, canvas.height / 2 - 110, "white");
        this.renderer.drawText(
            "PRESS ANY KEY TO START",
            50,
            true,
            500,
            "white",
        );
    }

    private getRandomTile(condition?: (tile: Tile) => boolean): Tile {
        const allTiles = flatten<Tile>(this.tiles);
        const possibleTiles =
            condition === undefined ? allTiles : allTiles.filter(condition);
        const randomTileIndex = randomRange(0, possibleTiles.length - 1);
        return possibleTiles[randomTileIndex];
    }
}
