import './ArrayExtra'
import './RectangleExtra'

export function Sleep(timeMS: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), timeMS);
    });
}