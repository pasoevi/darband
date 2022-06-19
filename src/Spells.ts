import { Actor, ConfusionEffect } from './actor/Actor';
import { Monster } from './actor/Monster';
import { Sprites } from './lib/CanvasDrawingLibrary';

export const spells = {
    blink(caster: Monster): void {
        caster.move(caster.game.getRandomPassableTile());
    },
    quake(caster: Actor): void {
        const { tiles } = caster.game;
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles.length; x++) {
                const { tile } = caster;
                if (tile.monster) {
                    const numWalls = 4 - tile.getAdjacentPassableTiles().length;
                    tile.monster.life?.takeDamage(caster, numWalls * 10, []);
                }
            }
        }
        caster.game.animation.shakeAmount = 20;
    },
    maelstrom(caster: Actor): void {
        const { game } = caster;
        const { monsters } = game;
        // eslint-disable-next-line no-restricted-syntax
        for (const monster of monsters) {
            monster.move(game.getRandomPassableTile());
        }
    },
    mulligan(caster: Actor): void {
        caster.game.startLevel(caster.game.levelID);
    },
    aura(caster: Actor): void {
        // eslint-disable-next-line no-restricted-syntax
        for (const tile of caster.tile.getAdjacentNeighbors()) {
            tile.setAnimationEffect(13);
            if (tile.monster) {
                tile.monster.life?.heal(5);
            }
            caster.tile.setAnimationEffect(13);
            caster.life?.heal(5);
        }
    },
    dash(caster: Monster): void {
        const newTile = caster.tile;
        let testTile;

        do {
            testTile = newTile.getNeighbor(
                caster.lastMove.x,
                caster.lastMove.y,
            );
        } while (testTile.passable && !testTile.monster);

        if (caster.tile !== newTile) {
            caster.move(newTile);
            // eslint-disable-next-line no-restricted-syntax
            for (const tile of newTile.getAdjacentNeighbors()) {
                if (tile.monster) {
                    tile.setAnimationEffect(Sprites.AURA);
                    tile.monster.stunned = true;
                    tile.monster.life?.takeDamage(caster, 10, []);
                }
            }
        }
    },
    confuse(caster: Actor, target: Monster): void {
        if (target.ai === undefined) {
            return;
        }

        target.addEffect(ConfusionEffect);
    },
};
