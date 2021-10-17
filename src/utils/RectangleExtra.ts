import { Rectangle } from '@pixi/math'

declare module '@pixi/math' {
    interface Rectangle {
        intersects(other: Rectangle): boolean
    }
}

Rectangle.prototype.intersects = function (other: Rectangle) {
    const x0 = this.x < other.x ? other.x : this.x;
    const x1 = this.right > other.right ? other.right : this.right;
    if (x1 < x0) {
        return false;
    }
    const y0 = this.y < other.y ? other.y : this.y;
    const y1 = this.bottom > other.bottom ? other.bottom : this.bottom;
    return y1 >= y0;
}