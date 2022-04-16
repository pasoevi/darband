import { Game, GameState } from '../Game';
import { GameUI } from '../lib/Interfaces';

export class CanvasUI implements GameUI {
    /*
     * Display message using the rendering library the game was set up with.
     * @param color might be ignored if the rendering library does not support it.
     */
    public msg(game: Game, text: string, color = 'violet'): void {
        game.logging.log(text);
        
        game.renderer.drawText(
            'Level: ' + game.levelID,
            25,
            false,
            40,
            color,
        );
    }

    /*
     * Render the UI based on the game
     */
    public render(game: Game): void {
        game.renderer.drawText(
            'Level: ' + game.levelID,
            25,
            false,
            40,
            'violet',
        );
    }

    public renderTitleScreen(game: Game): void {
        game.renderer.drawRect('rgba(0,0,0,.75)', 0, 0);
        game.gameState = GameState.TITLE;

        // this.renderer.drawText("SUPER", 40, true, canvas.height / 2 - 110, "white");
        game.renderer.drawText(
            'PRESS ANY KEY TO START',
            50,
            true,
            500,
            'white',
        );
    }

    public renderGameOverScreen(game: Game): void {
        game.renderer.drawRect('rgba(0,0,0,.5)', 0, 0);

        game.renderer.drawText(
            'YOU DIE',
            50,
            true,
            300,
            'red',
        );

        game.renderer.drawText(
            'PRESS ANY KEY TO START AGAIN',
            40,
            true,
            400,
            'white',
        );
    }
}
