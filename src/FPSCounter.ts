let lastTick = 0;
let currentTick = 0;
let lastFPS = 0;
let currentFPS = 0;

export function UpdateTick() {
    lastTick = currentTick;
    currentTick = Date.now();
}

export function GetFPS() {
    let tmp = (lastFPS + Math.floor((1000 / (currentTick - lastTick)) * 10) / 10) / 2;
    lastFPS = currentFPS;
    currentFPS = tmp;
    return currentFPS;
}