import { History  } from './history/History';
import { Item } from './Item';
import { Animation, GameUI, LoggingLibrary, RenderingLibrary } from './lib/Interfaces';
import {
    createMonster,
    Dragon,
    Goblin,
    Kobold,
    Man,
    Monster,
    Snake,
    Troll,
    Wolf,
} from './Monster';
import { Player } from './Player';
import { spells } from './Spells';
import { Floor, StaircaseDown, StaircaseUp, Tile, Wall } from './Tile';
import { flatten, randomRange, tryTo } from './Util';

export interface GameOptions {
    renderingLibrary: RenderingLibrary;
    ui: GameUI;
    logging: LoggingLibrary;
}

export type GameState = 'LOADING' | 'PLAYING' | 'DEAD' | 'TITLE';

export class Game {
    private static instance: Game;
    public renderer: RenderingLibrary;
    public ui: GameUI;
    public history: History;
    public logging: LoggingLibrary;
    public player = (null as unknown) as Player;
    public tiles: Array<Array<Tile>> = [];
    public monsters: Monster[] = [];
    public items: Item[] = [];
    // TODO: Use in getPossibleMonsters
    public levelID = 0;
    public maxLevelID = 16;
    public gameState: GameState = 'TITLE';
    public animation: Animation;

    private constructor(options: GameOptions) {
        this.renderer = options.renderingLibrary;
        this.ui = options.ui;
        this.history = new History();
        this.logging = options.logging;
        this.renderer.setOnRendererReady(() => {
            this.ui.renderTitleScreen(this);
            setInterval(() => {
                this.render();
            }, 15);
        });
        this.animation = {
            offsetX: 0,
            offsetY: 0,
            shakeAmount: 0,
            shakeX: 0,
            effectSprite: undefined,
            effectCounter: 0,
            shakeY: 0,
            // TODO: Create a GameAnimation class
            screenshake() {
                if (this.shakeAmount) {
                    this.shakeAmount--;
                }
                const shakeAngle = Math.random() * Math.PI * 2;
                this.shakeX = Math.round(
                    Math.cos(shakeAngle) * this.shakeAmount,
                );
                this.shakeY = Math.round(
                    Math.sin(shakeAngle) * this.shakeAmount,
                );
            },
        };
    }

    public static getInstance(options?: GameOptions): Game {
        if (Game.instance === undefined) {
            if (options === undefined) {
                throw new Error(
                    'getInstance needs to be passed the parameters when called for the fist time',
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

    private setupInputHandlers() {
        const html = document.querySelector('html');
        if (html === null) {
            throw Error('Please run the app in the browser environment');
        }
        html.onkeydown = (e) => {
            if (this.gameState === 'TITLE') {
                this.startGame();
            } else if (this.gameState === 'DEAD') {
                this.ui.renderTitleScreen(this);
            } else if (this.gameState === 'PLAYING') {
                if (this.player === undefined) {
                    return;
                }
                switch (e.key) {
                case 'w':
                    this.player.tryMove(0, -1);
                    break;
                case 's':
                    this.player.tryMove(0, 1);
                    break;
                case 'a':
                    this.player.tryMove(-1, 0);
                    break;
                case 'd':
                    this.player.tryMove(1, 0);
                    break;
                case 'Enter':
                    this.startLevel(this.levelID + 1);
                    break;
                case 'c':
                    spells.confuse(this.player, this.monsters[0]);
                    break;
                    // Monster movements (temporary feature)
                case 'ArrowUp':
                    this.monsters[0].tryMove(0, -1);
                    break;
                case 'ArrowDown':
                    this.monsters[0].tryMove(0, 1);
                    break;
                case 'ArrowLeft':
                    this.monsters[0].tryMove(-1, 0);
                    break;
                case 'ArrowRight':
                    this.monsters[0].tryMove(1, 0);
                    break;

                default:
                    break;
                }
            }
        };
    }

    public setupGame(): void {
        this.setupInputHandlers();
    }

    private startGame(): void {
        this.gameState = 'PLAYING';
        this.startLevel(0);
    }

    public startLevel(levelId: number): void {
        this.levelID = levelId;
        this.generateLevel();
    }

    private generateLevel(): void {
        tryTo('generate map', () => {
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
            [Dragon, Man, Goblin, Snake, Kobold],
            [Dragon, Man, Goblin, Snake, Kobold],
            [Dragon, Man, Goblin, Snake, Kobold],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Dragon, Dragon, Wolf, Wolf, Man, Troll, Snake, Snake],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Kobold, Goblin],
            [Kobold, Goblin],
        ];
        // const n = randomRange(2, 2);
        for (const monster of allMonsters[this.levelID]) {
            monsters.push(createMonster(monster));
        }
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
            this.gameState = 'DEAD';
        }
    }

    public render(): void {
        if (this.gameState === 'PLAYING' || this.gameState === 'DEAD') {
            this.renderer.clearScreen();
            if (this.animation.screenshake) {
                this.animation.screenshake();
            }
            this.renderTiles();
            this.renderMonsters();
            this.player.draw();
            this.ui.render(this);
        }
    }

    private getRandomTile(condition?: (tile: Tile) => boolean): Tile {
        const allTiles = flatten<Tile>(this.tiles);
        const possibleTiles =
            condition === undefined ? allTiles : allTiles.filter(condition);
        const randomTileIndex = randomRange(0, possibleTiles.length - 1);
        return possibleTiles[randomTileIndex];
    }
}
