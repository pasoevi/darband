import { RenderOptions, RenderingLibrary } from "./interfaces";
import sprites from "../../assets/sprites.png";

export class CanvasDrawingLibrary implements RenderingLibrary {
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    options: RenderOptions;
    spritesheet: HTMLImageElement;
    isRendererReady = false;
    onRendererReady: () => void;

    public setOnRendererReady(onReady: () => void): void {
        if (this.isRendererReady) {
            onReady();
        } else {
            this.onRendererReady = onReady;
        }
    }

    constructor(canvasElementId: string, options: RenderOptions) {
        const canvas = document.getElementById(
            canvasElementId,
        ) as HTMLCanvasElement;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.options = options;

        this.context.imageSmoothingEnabled = false;

        const { tileSize, numTiles, uiWidth } = options;

        canvas.width = tileSize * (numTiles + uiWidth);
        canvas.height = tileSize * numTiles;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        this.loadAssets();
    }

    public loadAssets(): void {
        this.spritesheet = new Image();
        this.spritesheet.src = sprites;
        this.spritesheet.onload = () => {
            this.isRendererReady = true;
            this.onRendererReady();
        };
    }

    public drawSprite(sprite: number, x: number, y: number): void {
        const ctx = this.context;
        const spriteSize = 32; // TODO: Get from the image filename
        const { tileSize } = this.options;
        ctx.drawImage(
            this.spritesheet,
            sprite * spriteSize,
            0,
            spriteSize,
            spriteSize,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public draw(x: number, y: number, tile: temporaryAny): void {
        const ctx = this.context;
        const { tileSize } = this.options;
        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        /* ctx.fillStyle = "blue";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize); */
        this.drawSprite(0, x, y);
    }

    public clearScreen(): void {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
