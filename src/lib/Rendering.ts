import sprites from "../../assets/sprites.png";
import { RenderingLibrary, RenderOptions } from "./interfaces";

export class CanvasDrawingLibrary implements RenderingLibrary {
    public context: CanvasRenderingContext2D;
    public options: RenderOptions;
    private canvas: HTMLCanvasElement;
    private readonly spritesheet: HTMLImageElement;
    private isRendererReady = false;
    private onRendererReady: () => void;

    public constructor(canvasElementId: string, options: RenderOptions) {
        const canvas = document.getElementById(
            canvasElementId,
        ) as HTMLCanvasElement;
        this.canvas = canvas;
        const ctx = this.canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("No matching drawing context supported");
        }
        this.context = ctx;
        this.options = options;

        this.context.imageSmoothingEnabled = false;

        // Can also be assigned by calling setOnRendererReady
        this.onRendererReady =
            options.onRendererReady ??
            (() => {
                /* tmp */
            });

        const { tileSize, numTiles, uiWidth } = options;

        canvas.width = tileSize * (numTiles + uiWidth);
        canvas.height = tileSize * numTiles;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

        this.spritesheet = new Image();
        this.loadAssets();
    }

    public setOnRendererReady(onReady: () => void): void {
        if (this.isRendererReady) {
            onReady();
        } else {
            this.onRendererReady = onReady;
        }
    }

    public loadAssets(): void {
        this.spritesheet.src = sprites;
        this.spritesheet.onload = () => {
            this.isRendererReady = true;
            this.onRendererReady();
        };
    }

    public drawSprite(sprite: number, x: number, y: number): void {
        const ctx = this.context;
        const { tileSize } = this.options;
        const spritesheetRows = this.spritesheet.height / tileSize;
        const spritesheetColumns = this.spritesheet.width / tileSize;
        const spriteRow = Math.floor(sprite / spritesheetColumns) * tileSize;
        const spriteColumn = (sprite % spritesheetRows) * tileSize;

        ctx.drawImage(
            this.spritesheet,
            spriteColumn,
            spriteRow,
            tileSize,
            tileSize,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize,
        );
    }

    public drawRect(
        color: string,
        x: number,
        y: number,
        w = this.canvas.width,
        h = this.canvas.height,
    ): void {
        const ctx = this.context;
        const oldColor = ctx.fillStyle;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = oldColor;
    }

    public drawText(
        text: string,
        size: number,
        centered: boolean,
        textY: number,
        color: string,
    ): void {
        // TODO: Allow access to canvas element or canvas size
        this.context.fillStyle = color;
        this.context.font = size + "px monospace";
        let textX;
        if (centered) {
            textX =
                (this.canvas.width - this.context.measureText(text).width) / 2;
        } else {
            textX =
                this.canvas.width -
                this.options.uiWidth * this.options.tileSize;
        }

        this.context.fillText(text, textX, textY);
    }

    public clearScreen(): void {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
