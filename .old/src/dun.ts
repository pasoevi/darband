/*
- Definitions for non-npm version of rotjs
import rot from "../lib/rotjs/rot.js";
*/
import * as rot from "rot-js";
const Display = rot.Display;
const Scheduler = rot.Scheduler;
const Engine = rot.Engine;
const RNG = rot.RNG;
const Map = rot.Map;
const FOV = rot.FOV;
const Path = rot.Path;
const DIRS = rot.DIRS;

// import { Display, Scheduler, Engine, RNG, Map, FOV, Path, DIRS } from "rot-js";

export {
    Display,
    Scheduler,
    Engine,
    RNG,
    Map,
    FOV,
    Path,
    DIRS
};