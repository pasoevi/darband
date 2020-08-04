import { ActorTemplate } from "./actor";

const Colors = {
    wall: "#c3c3c3",
    floor: "#323232",
    fire: "#e25822",
    ice: "#a5f2f3",
    poison: "#45f12c",
    magic: "#8b008b",
    chaos: "#d40f0f",
    wealth: "#c6c6c6",
    gold_metallic: "#d4af37",
    gold_old: "#cfb53b",
    gold_yellow: "#ffdf00",
    red: "#ff0000",
    white: "#ffffff",
    black: "#000000",
    orange: "#aa8811",
    blue: "#0000FF",
    purple: "#440044",
};

export const ActorType = {
    MONSTER: "monster",
    WEAPON: "weapon",
    POTION: "potion",
};

const Levels = [
    {
        domain: "abstracts",
        levelID: 0,
    },
    {
        domain: "dungeons",
        levelID: 1,
    },
    {
        domain: "dungeons",
        levelID: 2,
    },
    {
        domain: "dungeons",
        levelID: 3,
    },
    {
        domain: "dungeons",
        levelID: 4,
    },
    {
        domain: "dungeons",
        levelID: 5,
    },
    {
        domain: "dungeons",
        levelID: 6,
    },
    {
        domain: "dungeons",
        levelID: 7,
    },
    {
        domain: "dungeons",
        levelID: 8,
    },
    {
        domain: "dungeons",
        levelID: 9,
    },
    {
        domain: "dungeons",
        levelID: 10,
    },
    {
        domain: "dungeons",
        levelID: 11,
    },
    {
        domain: "dungeons",
        levelID: 12,
    },
    {
        domain: "dungeons",
        levelID: 13,
    },
    {
        domain: "gates",
        levelID: 14,
    },
    {
        domain: "gates",
        levelID: 15,
    },
    {
        domain: "gates",
        levelID: 16,
    },
    {
        domain: "gates",
        levelID: 17,
    },
    {
        domain: "gates",
        levelID: 18,
    },
    {
        domain: "gates",
        levelID: 19,
    },
    {
        domain: "gates",
        levelID: 20,
    },
    {
        domain: "gates",
        levelID: 21,
    },
    {
        domain: "gates",
        levelID: 22,
    },
    {
        domain: "gates",
        levelID: 23,
    },
    {
        domain: "gates",
        levelID: 24,
    },
    {
        domain: "gates",
        levelID: 25,
    },
    {
        domain: "gates",
        levelID: 26,
    },
];

const WizardLife = {
    hp: 11100,
    maxHp: 11100,
    defence: 2,
    corpseName: "wizzard corpse",
};

const SimpleLife = {
    hp: 110,
    maxHp: 110,
    defence: 2,
    corpseName: "corpse",
};

const SimpleAI = {
    quests: [],
    moveCount: 0,
    skills: [],
    xp: 10,
    xpLevel: 1,
};

const Races = {
    goblin: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [0, 1, 2],
    },

    kobold: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [0, 1, 2],
    },

    orc: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [0, 1, 2, 3],
    },

    dwarf: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [13, 14, 15, 16],
    },

    man: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [3],
    },

    troll: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [2],
    },

    elf: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [5],
    },

    dragon: {
        skills: {
            intelligence: 10,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            providence: 10,
        },
        lifeTemplate: SimpleLife,
        domains: [4],
    },
};

const Classes = [
    {
        name: "huttler",
        ch: "@",
        col: Colors.white,
        themeColor: Colors.wealth,
        speed: 120,
        lifeTemplate: WizardLife,
    },
    {
        name: "dark elf",
        ch: "@",
        col: Colors.white,
        themeColor: Colors.magic,
        speed: 130,
        lifeTemplate: WizardLife,
    },
    {
        name: "wizard",
        ch: "@",
        col: Colors.white,
        themeColor: Colors.magic,
        speed: 100,
        lifeTemplate: WizardLife,
    },
    {
        name: "dwarf",
        ch: "@",
        col: Colors.white,
        themeColor: Colors.gold_metallic,
        speed: 90,
        lifeTemplate: WizardLife,
    },
    {
        name: "human",
        ch: "@",
        col: Colors.white,
        themeColor: Colors.ice,
        speed: 120,
        lifeTemplate: WizardLife,
    },
];

const Items = [
    {
        name: "dagger",
        ch: "_",
        col: "#dfd",
        speed: 100,
        domains: [1, 2, 5, 6],
    },
    {
        name: "long sword",
        ch: "}",
        col: "#2f9",
        speed: 100,
        domains: [1, 5, 5, 6],
    },
    {
        name: "knife",
        ch: "-",
        col: "#2f9",
        speed: 100,
        domains: [1, 4, 5, 6],
    },
    {
        name: "orc",
        ch: "+",
        col: "#2f9",
        speed: 100,
        domains: [3, 4, 5, 6],
    },
    {
        name: "orc",
        ch: "(",
        col: "#2f9",
        speed: 100,
        domains: [3, 4, 5, 6],
    },
    {
        name: "orc",
        ch: ")",
        col: "#2f9",
        speed: 100,
        domains: [3, 4, 5, 6],
    },
    {
        name: "orc",
        ch: ")",
        col: "#2f9",
        speed: 100,
        domains: [3, 4, 5, 6],
    },
    {
        name: "blue potion",
        ch: "_",
        col: Colors.blue,
        speed: 100,
        domains: [1, 3],
    },
    {
        name: "purple potion",
        ch: "_",
        col: Colors.purple,
        speed: 100,
        domains: [2, 3, 4, 5],
    },
];

const Monsters = [
    {
        name: "orc",
        ch: "o",
        col: "#2f9",
        speed: 100,
        race: Races.orc,
    },
    {
        name: "gray wolf",
        ch: "w",
        col: "#888",
        speed: 120,
        race: Races.goblin,
    },
    {
        name: "dragon",
        ch: "D",
        col: "#0fc",
        speed: 80,
        race: Races.dragon,
    },
    {
        name: "dwarf",
        ch: "d",
        col: "#9f1",
        speed: 100,
        race: Races.dwarf,
    },
    {
        name: "elf",
        ch: "e",
        col: "#24e",
        speed: 100,
        race: Races.elf,
    },
];

export function getPossibleMonsters(levelID: number) {
    const possibleMonsters = Monsters.filter(
        (monster) => monster.race.domains.indexOf(levelID) >= 0,
    ).map((monster) =>
        monster.lifeTemplate
            ? monster
            : { ...monster, lifeTemplate: SimpleLife },
    );
    return possibleMonsters;
}

const Texts = {
    en: {
        quotes: [
            `He who fights monsters must take care lest he thereby
become a monster`,
            "Live for today, for tomorrow never comes.",
            "Always watch and follow nature",
            "Where many die there is no fear of death",
            "Deceit sleeps with greed",
            "There is nothing sinister in sorcery, only in the hearts of men.",
            "Only he who wanders can find new paths.",
            "Death answers before she is asked. ",
            "The world needs more heroes.",
            "Better unlearned and bright, than erudite and foolish.",
            "Better go without healing, than call for an unskilled healer.",
            "Skill is not a heavy load to carry.",
            "Even the best climber may fall.",
            "There is no death for the honourable, only a change of bodies.",
            "Straight ahead is always shortest, but not always best.",
            "The sky is no less blue only because the blind can not see it.",
            "Death smiles at us all. All a man can do is to smile back.",
            "Nowhere are there more hiding places than in the heart.",
            "What is the use of running when we are not on the right track?",
            "When men speak ill of you, live so that nobody will believe them.",
            "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.",
            "Hope is the dreams of the man awake.",
            "He who starts a fight had better do the fighting himself.",
            "Do not cry before you are hurt.",
            "Cowards may die many times before their deaths.",
            "Fear the reckoning of those you have wronged.",
            "He who becomes a sheep will be eaten by the wolf.",
            "The art of living well and the art of dying well is one.",
            "Heroism consists in hanging on one minute longer.",
            "Men brave and generous live the best lives, seldom will they sorrow; then there are fools, afraid of everything, who grumble instead of giving.",
        ],
        poems: [],
    },
    ru: {
        quotes: [
            `He who fights monsters must take care lest he thereby
become a monster`,
            "Live for today, for tomorrow never comes.",
            "Always watch and follow nature",
            "Where many die there is no fear of death",
            "Deceit sleeps with greed",
        ],
        poems: [],
    },
};

const Settings = {
    programName: "darband",
    version: "0.0.1",
    debug: true,
    test: false,
    mapW: 36,
    mapH: 13,
    windowW: 36,
    windowH: 16,
    logHeight: 8,
    msg: {
        // Message box location
        x: 5,
        y: 0,
    },
    game: {
        winLevel: 0,
        startLevel: 16,
    },
};

export {
    Settings,
    Colors,
    Levels,
    Races,
    Classes,
    Monsters,
    Items,
    Texts,
    SimpleAI,
    WizardLife,
};
