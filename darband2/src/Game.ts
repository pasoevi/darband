import { RenderingLibrary, GameUI } from "./lib/interfaces";
import { Player } from "./player";
import { Wall, Floor, Tile } from "./Tile";
import { Monster } from "./Monster";
import { randomRange, flatten, tryTo } from "./Util";

export interface GameOptions {
    renderingLibrary: RenderingLibrary;
    ui: GameUI;
}

export class Game {
    private static instance: Game;
    renderer: RenderingLibrary;
    ui: GameUI;
    player: Player | undefined;
    tiles: Array<Array<Tile>> = [];
    onRendererReady: () => void = () => {
        /* noop */
    };
    monsters: Monster[] = [];

    private constructor(options: GameOptions) {
        this.renderer = options.renderingLibrary;
        this.ui = options.ui;
        this.renderer.setOnRendererReady(() => {
            this.render();
        });
    }

    public getRandomTile(condition?: (tile: Tile) => boolean): Tile {
        const allTiles = flatten(this.tiles);
        const possibleTiles =
            condition === undefined ? allTiles : allTiles.filter(condition);
        const randomTileIndex = randomRange(0, possibleTiles.length - 1);
        return possibleTiles[randomTileIndex];
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
                if (e.key == "w") this.player.y--;
                if (e.key == "s") this.player.y++;
                if (e.key == "a") this.player.x--;
                if (e.key == "d") this.player.x++;

                // Monster movements (temporary feature)
                if (e.which == 38) {
                    this.monsters[0].y--;
                }
                if (e.which == 40) {
                    this.monsters[0].y++;
                }
                if (e.which == 37) {
                    this.monsters[0].x--;
                }
                if (e.which == 39) {
                    this.monsters[0].x++;
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
                this.getRandomTile((t: Tile) => t.passable).getConnectedTiles()
                    .length
            );
        });
        const startingTile = this.getRandomTile((tile: Tile) => tile.passable);
        this.player = new Player({
            name: "You",
            char: "@",
            sprite: 0,
            x: startingTile.x,
            y: startingTile.y,
        });
        this.monsters = this.generateMonsters();
    }
    generateMonsters(): Monster[] {
        const monsters = [];
        const startingTile = this.getRandomTile((t: Tile) => t.passable);
        monsters.push(
            new Monster({
                name: "Red bug",
                char: "b",
                sprite: 4,
                x: startingTile.x,
                y: startingTile.y,
            }),
        );
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

    public tick(): void {
        for (let k = this.monsters.length - 1; k >= 0; k--) {
            if (this.monsters[k].life?.isAlive()) {
                // this.monsters[k].update();
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
}
