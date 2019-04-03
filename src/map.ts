import { FOV, Map, RNG } from './dun'

import { Colors } from './datafiles'
import { Game } from './game'
import { random } from './lang'

const game = Game.getSingleton()

export class Tile {
    private position: MapPosition
    private block: boolean
    private expl: boolean
    private ch: string
    private col: string

    constructor(
        position: MapPosition,
        blocking: boolean,
        explored: boolean,
        ch = "",
        color = ""
    ) {
        this.position = position;
        this.block = blocking;
        this.expl = explored;
        this.ch = ch;
        this.col = color;
    }

    public getCh() {
        if (typeof this.ch !== 'undefined') {
            return this.ch
        }
        return this.isBlocking() ? '#' : '.'
    }

    public setCh(char: string) {
        this.ch = char
    }

    public getColor() {
        if (this.col) {
            return this.col
        }
        return this.getCh() === '#' ? Colors.wall : Colors.floor
    }

    public setColor(color: string) {
        this.col = color
    }

    public setExplored(explored: boolean) {
        this.expl = explored
    }

    public isExplored() {
        return this.expl
    }

    public isBlocking() {
        return this.block
    }

    public setBlocking(blocking: boolean) {
        this.block = blocking
    }

    public getPos() {
        return this.position
    }

    public setPos(position: MapPosition) {
        this.position = position
    }

    public draw() {
        if (this.expl) {
            let color = this.getColor()
            game.display.draw(
                this.position.x,
                this.position.y,
                this.getCh(),
                color,
                '#000'
            )
        } else {
            game.display.draw(this.position.x, this.position.y, ' ')
        }
    }
}

export class TileMap {
    private width: number
    private height: number
    private tiles: Tile[]
    private fov: FOV.PreciseShadowcasting

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.tiles = []
        this.fov = new FOV.PreciseShadowcasting(this.lightPasses)
    }

    public getTiles() {
        return this.tiles
    }

    public isPosOnMap(position: MapPosition) {
        if (position.x < 0 || position.x >= this.width) {
            return false
        }

        return position.y >= 0 && position.y <= this.height
    }

    public getTile(pos: MapPosition) {
        return this.tiles.find(el => {
            return el.getPos().x === pos.x && el.getPos().y === pos.y
        })
    }

    public getRandomTile() {
        return random(this.tiles)
    }

    public createStaircase(
        freeCells: Tile[],
        direction: string,
        color: string
    ) {
        let index = Math.floor(RNG.getUniform() * freeCells.length)
        let staircase = freeCells[index]
        staircase.setCh(direction)
        staircase.setColor(color)
        return staircase
    }

    public generate() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let wall = new Tile({ x: x, y: y}, true, false);
                this.tiles.push(wall)
            }
        }

        let digger = new Map.Digger()
        let digCallback = (x: number, y: number, value: number) => {
            let tileAt = this.getTile({ x: x, y: y })
            if (tileAt) {
                tileAt.setBlocking(value > 0) // TODO: Fix
                tileAt.setExplored(false)
            }
        }

        digger.create(digCallback)
    }

    public getFreeCells() {
        return this.tiles.filter(function(elem) {
            return !elem.isBlocking()
        })
    }

    /* input callback */
    private lightPasses(x: number, y: number) {
        const tileAt = this.getTile({ x, y })
        if (tileAt && tileAt.getCh() === '.') {
            return true
        }
        return false
    }

    public computeFov(pos: MapPosition) {
        /* output callback */
        this.fov.compute(pos.x, pos.y, 10, (x, y, r, visibility) => {
            if (visibility) {
                let tileAt = this.getTile({ x: x, y: y })
                if (tileAt && !tileAt.isExplored()) {
                    tileAt.setExplored(true)

                    let monsterAt = game.level.getActorAt(tileAt)
                    if (monsterAt) {
                        game.scheduler.add(monsterAt, false)
                    }
                }
            }
        })
    }

    public draw() {
        for (const tile of this.tiles) {
            tile.draw()
        }
    }
}

export interface MapPosition {
    x: number
    y: number
}
