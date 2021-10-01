export function Sleep(timeMS: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve, timeMS);
    });
}