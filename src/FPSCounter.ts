let lastTick = Date.now();
let currentTick = Date.now();
let fpsList: number[] = [];

export function UpdateTick() {
    lastTick = currentTick;
    currentTick = Date.now();
    
    let fps = 1000 / GetFrametime();
    if (fpsList.length === 60)
        fpsList.shift();
    fpsList.push(fps);
}

export function GetFPS() {
    return fpsList.length ? Math.round(fpsList.reduce((a, b) => a + b) / fpsList.length * 10) / 10 : 0;
}

export function GetFrametime() {
    return currentTick - lastTick;
}