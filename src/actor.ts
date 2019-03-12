import { Message, dbg } from './Message'

import { Colors } from './datafiles'
import { Game } from './game'
import { Weapon, weapon, Modifier } from './weapon'
import { Item } from './item'
import { MapPosition } from './map'

class Inventory {
  private weapon: Weapon
  private items: Item[]

  constructor() {
    this.weapon = {
      power: 10
    }
    this.items = []
  }

  public getCurrentWeapon() {
    return this.weapon
  }

  public pickItem(item: Item) {
    this.items.push(item)
  }
}

class Quest {
  public getName() {
    return 'Some quest'
  }
}

interface Skill {
  value: number
  name: string
}

class AI {
  private skills: Skill[]
  private quests: Quest[]
  private xp: number
  private xpLevel: number

  constructor() {
    this.skills = []
    this.quests = []
    this.xp = 0
    this.xpLevel = 0
  }

  public getSkills() {
    return this.skills
  }

  public getQuests() {
    return this.quests
  }

  public addQuest(quest: Quest) {
    this.quests.push(quest)
  }

  public getXP() {
    return this.xp
  }

  public getXpLevel() {
    return this.xpLevel
  }
}

class Life {
  private hp: number
  private maxHp: number
  private defence: number
  private corpseName: string
  private actor: Actor

  constructor(spec: Life, actor: Actor) {
    this.hp = spec.hp
    this.maxHp = spec.maxHp
    this.defence = spec.defence
    this.corpseName = spec.corpseName
    this.actor = actor
  }

  public die() {
    this.hp = 0
    Message(`${this.actor.getName()} dies`)
    Game.scheduler.remove(this.actor)
  }

  public isAlive() {
    return this.hp > 0
  }

  /**
   * Take value damage from dealer, i.e subtract value from the dealer.
   * @param dealer
   * @param weapon - null means barehanded attack
   * @param value - hp to subtract
   * @param modifiers
   * @return {number} actual damage taken.
   */
  public takeDamage(
    dealer: Actor,
    weapon: Weapon,
    value: number,
    modifiers: Modifier[]
  ) {
    let damageTaken = value

    if (!dealer || !this.isAlive()) {
      return damageTaken
    }

    if (weapon) {
      damageTaken = weapon.power - this.defence
    }

    damageTaken = modifiers.reduce(
      (prev, current) => prev + current.value,
      damageTaken
    )

    Message(`${this.hp} was and now is ${damageTaken} less`)
    Message(
      `${dealer.getName()} attacks ${this.getName()} for ${damageTaken} hp`,
      Colors.red
    )

    if (this.hp - damageTaken > 0) {
      this.hp -= damageTaken
    } else {
      this.die()
    }

    return damageTaken
  }
}

/**
 * Any object that can be located on the map, that has position, and
 * can be drawn.
 *
 * Examples: monsters, items you can pick (potions, weapons, etc.)
 * other items on the map - staircases, fountains, altars, etc.
 *
 * Player and all monsters inherit from this prototype.
 * @param spec
 * @constructor
 */
export class Actor {
  private position: MapPosition
  private name: string
  private col: string
  private ch: string

  private life?: Life
  private inventory?: Inventory
  private ai?: AI

  constructor(spec: ActorTemplate) {
    this.position = {
      x: spec.x,
      y: spec.y
    }

    this.name = spec.name
    this.col = spec.col
    this.ch = spec.ch

    const lifeTemplate =
      spec.lifeTemplate || (spec.race && spec.race.lifeTemplate)

    if (lifeTemplate) {
      this.life = new Life(lifeTemplate, this)
    }

    if (spec.aiTemplate) {
      this..ai = new AI(spec.aiTemplate)
    }

    if (spec.itemTemplate) {
      actor.ai = spec.itemTemplate
    }
  }

  public getName() {
    return this.name
  }

  public getColor() {
    return this.col
  }

  public getChar() {
    return this.ch
  }

  public getPos() {
    return this.position
  }

  public setPos(pos: MapPosition) {
    if (!Game.level.map.isPosOnMap(pos.x, pos.y)) {
      dbg('Not on map')
      return
    }

    this.position = pos
    Game.level.map.computeFov(pos)
  }

  public draw() {
    if (this.life !== undefined && this.life.isAlive()) {
      Game.display.draw(
        this.position.x,
        this.position.y,
        this.ch,
        this.col,
        Colors.black
      )
    } else {
      Game.display.draw(
        this.position.x,
        this.position.y,
        this.ch,
        Colors.gold_yellow,
        Colors.black
      )
    }
  }
}

export interface ActorTemplate {
  x: number;
  y: number;
  speed: number;
  name: string;
  col: string;
  ch: string; // TODO: Make a type that lists every possible visible character
  lifeTemplate?: LifeTemplate;
  itemTemplate?: ItemTemplate;
  aiTemplate?: ItemTemplate;
}
export interface LifeTemplate {
  hp: number;
  maxHp: number;
}

export interface ItemTemplate {
  x: number;
  y: number;
  name: string;
}

export interface AITemplate {
  x: number;
  y: number;
  name: string;
}


