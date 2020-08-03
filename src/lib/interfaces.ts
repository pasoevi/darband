export interface RenderingLibrary {
    clearScreen(): void;
    drawSprite(sprite: number, x: number, y: number): void;
    drawRect(color: string, x: number, y: number, w: number, h: number): void;
    setOnRendererReady(onReady: () => void): void;
    options: RenderOptions;
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
}
