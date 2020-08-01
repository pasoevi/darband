export interface RenderingLibrary {
    draw(x: number, y: number, tile: temporaryAny): void;
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
