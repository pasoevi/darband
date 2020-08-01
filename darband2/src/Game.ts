import { RenderingLibrary, InputHandler } from "./lib/interfaces";
import { Player } from "./player";

export class Game {
    private static instance: Game;
    renderer: RenderingLibrary;
    input: InputHandler;
    player: Player;

    private constructor(renderingLibrary: RenderingLibrary) {
        this.renderer = renderingLibrary;
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
        this.player.draw();
    }
}
