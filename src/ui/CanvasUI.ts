import { Game } from "../Game";
import { GameUI } from "../lib/interfaces";

export class CanvasUI implements GameUI {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public msg(game: Game, text: string, color?: string): void {
        // eslint-disable-next-line no-console
        console.log(text);
        game.renderer.drawText(
            "Level: " + game.levelID,
            25,
            false,
            40,
            "violet",
        );
    }

    public render(game: Game): void {
        game.renderer.drawText(
            "Level: " + game.levelID,
            25,
            false,
            40,
            "violet",
        );
    }

    public renderTitleScreen(game: Game): void {
        game.renderer.drawRect("rgba(0,0,0,.75)", 0, 0);
        game.gameState = "TITLE";

        // this.renderer.drawText("SUPER", 40, true, canvas.height / 2 - 110, "white");
        game.renderer.drawText(
            "PRESS ANY KEY TO START",
            50,
            true,
            500,
            "white",
        );
    }
}
