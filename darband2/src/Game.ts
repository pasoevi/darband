import { RenderingLibrary, InputHandler } from "./lib/interfaces";
import { Player } from "./player";
import { Wall, Floor, Tile } from "./Tile";

export class Game {
    private static instance: Game;
    renderer: RenderingLibrary;
    input: InputHandler;
    player: Player;
    tiles: Tile[];
    onRendererReady: () => void;

    private constructor(renderingLibrary: RenderingLibrary) {
        this.renderer = renderingLibrary;
        this.renderer.setOnRendererReady(() => {
            this.render();
        })
    }

    public setupGame(): void {
        this.player = new Player("You", 4, 0, 0);

        document.querySelector("html").onkeypress = (e) => {
            if (e.key == "w") this.player.y--;
            if (e.key == "s") this.player.y++;
            if (e.key == "a") this.player.x--;
            if (e.key == "d") this.player.x++;
            this.render();
        };
        this.generateLevel();
    }

    generateLevel(): void {
        this.tiles = this.generateTiles();
    }

    generateTiles(): Tile[] {
        const tiles = [];
        const numTiles = this.renderer.options.numTiles;
        for (let i = 0; i < numTiles; i++) {
            tiles[i] = [];
            for (let j = 0; j < numTiles; j++) {
                if (Math.random() < 0.3 || !this.inBounds(i, j)) {
                    tiles[i][j] = new Wall(i, j);
                } else {
                    tiles[i][j] = new Floor(i, j);
                }
            }
        }
        return tiles;
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

    public static getInstance(renderingLibrary?: RenderingLibrary): Game {
        if (Game.instance === undefined) {
            if (!renderingLibrary) {
                throw new Error(
                    "getInstance needs to be passed the parameters when called for the fist time",
                );
            }
            Game.instance = new Game(renderingLibrary);
        }
        return Game.instance;
    }

    render(): void {
        console.log('Arturs: Render');

        this.renderer.clearScreen();
        const numTiles = this.renderer.options.numTiles;
        for (let i = 0; i < numTiles; i++) {
            for (let j = 0; j < numTiles; j++) {
                this.getTile(i, j).draw();
            }
        }
        this.player.draw();
    }
}
