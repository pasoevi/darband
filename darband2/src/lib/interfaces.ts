export interface RenderingLibrary {
    clearScreen(): void;
    draw(x: number, y: number, tile: temporaryAny): void;
    drawSprite(sprite: number, x: number, y: number): void;
    setOnRendererReady(onReady: () => void): void;
    options: RenderOptions;
}

export interface RenderOptions {
    windowWidth: number;
    windowHeight: number;
    tileSize: number;
    numTiles: number;
    uiWidth: number;
}

export interface InputHandler {
    setup(): void;
}

export interface GameUI {
    msg: (game: temporaryAny, text: string, color?: string) => void;
}
