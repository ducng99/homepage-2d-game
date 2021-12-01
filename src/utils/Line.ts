import { Point } from "pixi.js";

export default class Line {
    Point1: Point;
    Point2: Point;

    constructor(point1: Point, point2: Point) {
        this.Point1 = point1;
        this.Point2 = point2;
    }
    
    /**
     * Check and get the intersection point of two lines
     * @param line the target line to check collision against
     * @returns an array:
     * - [0] = true if collision, false if not
     * - [1] = the point of collision
     */
    intersects(line: Line): [boolean, Point] {
        const x1 = this.Point1.x;
        const y1 = this.Point1.y;
        const x2 = this.Point2.x;
        const y2 = this.Point2.y;
        const x3 = line.Point1.x;
        const y3 = line.Point1.y;
        const x4 = line.Point2.x;
        const y4 = line.Point2.y;
        
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denom === 0) {
            return [false, new Point(0, 0)];
        }
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return [true, new Point(x1 + t * (x2 - x1), y1 + t * (y2 - y1))];
        }
        
        return [false, new Point(0, 0)];
    }
}