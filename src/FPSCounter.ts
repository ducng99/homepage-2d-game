let lastTick = Date.now();
let currentTick = Date.now();
let lastFPS: number[] = [];

export function UpdateTick() {
    lastTick = currentTick;
    currentTick = Date.now();
    
    let tmp = GetRawFPS();
    if (lastFPS.length === 60)
        lastFPS.shift();
    lastFPS.push(tmp);
}

export function GetFPS() {
    return lastFPS.length ? Math.round(lastFPS.reduce((a, b) => a + b) / lastFPS.length * 10) / 10 : 0;
}

export function GetRawFPS() {
    return 1000 / (currentTick - lastTick);
}