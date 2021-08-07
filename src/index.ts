import './index.css';

import { Game, GameOptions } from './Game';
import { CanvasDrawingLibrary } from './lib/CanvasDrawingLibrary';
import { RenderOptions } from './lib/Interfaces';
import { ConsoleLogging } from './lib/Logging';
import { CanvasUI } from './ui/CanvasUI';

function setupGame() {
    const renderOptions: RenderOptions = {
        tileSize: 32,
        numTiles: 19,
        uiWidth: 4,
    };
    const renderingLibrary = new CanvasDrawingLibrary('game', renderOptions);
    const gameUI = new CanvasUI();
    const logger = new ConsoleLogging();
    const gameOptions: GameOptions = {
        renderingLibrary: renderingLibrary,
        ui: gameUI,
        logging: logger,
    };
    const game = Game.getInstance(gameOptions);
    game.setupGame();
}

setupGame();
