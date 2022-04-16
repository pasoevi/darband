import { Actor } from '../Actor';
import { Game } from '../Game';

export interface RenderingLibrary {
    options: RenderOptions;
    clearScreen(): void;
    drawSprite(
        sprite: number,
        x: number,
        y: number,
        animation?: Animation,
    ): void;
    drawRect(color: string, x: number, y: number, w?: number, h?: number): void;
    drawText(
        text: string,
        size: number,
        centered: boolean,
        textY: number,
        color: string,
    ): void;
    setGlobalAlpha(value: number): void;
    resetGlobalAlpha(): void;
    setOnRendererReady(onReady: () => void): void;
}

export interface RenderOptions {
    tileSize: number;
    numTiles: number;
    uiWidth: number;
    onRendererReady?: () => void;
}

export interface InputHandler {
    setup(): void;
}

export interface GameUI {
    msg: (game: temporaryAny, text: string, color?: string) => void;
    render(game: Game): void;
    renderTitleScreen(game: Game): void;
    renderGameOverScreen(game: Game): void;
}

export interface Animation {
    offsetX: number;
    offsetY: number;
    shakeX: number;
    shakeY: number;
    shakeAmount: number;
    effectCounter: number;
    effectSprite?: number;
    screenshake?: () => void;
}

export interface PosOnMap {
    x: number;
    y: number;
}

/*
 * @experimental
 */
export interface Message {
    move?: number;
    actor?: Actor;
    text: string;
}

export interface LoggingLibrary {
    log: (message: string) => void;
}
