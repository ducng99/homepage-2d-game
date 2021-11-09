export function Sleep(timeMS: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), timeMS);
    });
}