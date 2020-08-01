import { CanvasDrawingLibrary } from "./lib/rendering";
import { Game } from "./Game";
import { RenderOptions } from "./lib/interfaces";
import "./index.css";

function setupGame() {
    const renderOptions: RenderOptions = {
        tileSize: 32,
        numTiles: 18,
        uiWidth: 4,
        windowWidth: 1000,
        windowHeight: 1000,
    };
    const renderingLibrary = new CanvasDrawingLibrary("game", renderOptions);
    const game = Game.getInstance(renderingLibrary);
    game.setupGame();
}

setupGame();
