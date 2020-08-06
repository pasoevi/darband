import { GameUI, RenderingLibrary } from "./lib/interfaces";
import { createMonster, Monster, Snake, } from "./Monster";
import { Player } from "./player";
import { Floor, Tile, Wall } from "./Tile";
import { flatten, randomRange, tryTo } from "./Util";

export interface GameOptions {
    renderingLibrary: RenderingLibrary;
    ui: GameUI;
}

export class Game {
    private static instance: Game;
    renderer: RenderingLibrary;
    ui: GameUI;
    player = (null as unknown) as Player;
    tiles: Array<Array<Tile>> = [];
    monsters: Monster[] = [];
    // TODO: Use in getPossibleMonsters
    levelID = 1;

    private constructor(options: GameOptions) {
        this.renderer = options.renderingLibrary;
        this.ui = options.ui;
        this.renderer.setOnRendererReady(() => {
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
        } else {
            html.onkeydown = (e) => {
                if (this.player === undefined) {
                    return;
                }
                if (e.key == "w") {
                    this.player.tryMove(0, -1);
                }
                if (e.key == "s") {
                    this.player.tryMove(0, 1);
                }
                if (e.key == "a") {
                    this.player.tryMove(-1, 0);
                }
                if (e.key == "d") {
                    this.player.tryMove(1, 0);
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
            };
        }
        this.generateLevel();
    }

    generateLevel(): void {
        tryTo("generate map", () => {
            return (
                this.generateTiles() ===
                this.getRandomPassableTile().getConnectedTiles().length
            );
        });

        const startingTile = this.getRandomPassableTile();

        // Create player
        this.player = new Player(startingTile);

        this.monsters = this.generateMonsters();
    }

    /* TODO: Not fully implemented */
    generateMonsters(): Monster[] {
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
            Snake,
        ];
        for (const monster of allMonsters) {
            const n = randomRange(0, 5);
            for (let i = 0; i < n; i++) {
                monsters.push(createMonster(monster));
            }
        }

        return monsters;
    }

    renderTiles(): void {
        const numTiles = this.renderer.options.numTiles;
        for (let i = 0; i < numTiles; i++) {
            for (let j = 0; j < numTiles; j++) {
                this.getTile(i, j).draw();
            }
        }
    }

    renderMonsters(): void {
        for (const monster of this.monsters) {
            monster.draw();
        }
    }

    generateTiles(): number {
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

    inBounds(x: number, y: number): boolean {
        const numTiles = this.renderer.options.numTiles;
        return x > 0 && y > 0 && x < numTiles - 1 && y < numTiles - 1;
    }

    getTile(x: number, y: number): Tile {
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
    }

    render(): void {
        this.renderer.clearScreen();
        this.renderTiles();
        this.renderMonsters();
        this.player?.draw();
    }

    private getRandomTile(condition?: (tile: Tile) => boolean): Tile {
        const allTiles = flatten<Tile>(this.tiles);
        const possibleTiles =
            condition === undefined ? allTiles : allTiles.filter(condition);
        const randomTileIndex = randomRange(0, possibleTiles.length - 1);
        return possibleTiles[randomTileIndex];
    }
}
