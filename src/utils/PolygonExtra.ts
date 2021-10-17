import { Polygon, Rectangle } from "@pixi/math"

declare module '@pixi/math' {
    interface Polygon {
        intersects(other: Polygon): boolean
        intersectsRect(other: Rectangle): boolean
    }
}

/**
 * polygon-polygon collision
 * based on http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
 * @param {Polygon} other polygon to check intersection
 * @return {boolean}
 */
Polygon.prototype.intersects = function (other: Polygon): boolean {
    let a = this.points;
    let b = other.points;
    let polygons = [a, b];
    let minA, maxA, projected, minB, maxB, j;

    for (let i = 0; i < polygons.length; i++) {
        let polygon = polygons[i];

        for (let i1 = 0; i1 < polygon.length; i1 += 2) {
            let i2 = (i1 + 2) % polygon.length;
            let normal = {
                x: polygon[i2 + 1] - polygon[i1 + 1],
                y: polygon[i1] - polygon[i2]
            }
            minA = maxA = null;

            for (j = 0; j < a.length; j += 2) {
                projected = normal.x * a[j] + normal.y * a[j + 1];
                if (minA === null || projected < minA) {
                    minA = projected;
                }
                if (maxA === null || projected > maxA) {
                    maxA = projected;
                }
            }

            minB = maxB = null;
            for (j = 0; j < b.length; j += 2) {
                projected = normal.x * b[j] + normal.y * b[j + 1];
                if (minB === null || projected < minB) {
                    minB = projected;
                }
                if (maxB === null || projected > maxB) {
                    maxB = projected;
                }
            }
            if (maxA! < minB! || maxB! < minA!) {
                return false;
            }
        }
    }

    return true;
}

Polygon.prototype.intersectsRect = function (other: Rectangle): boolean {
    let a = this.points;
    let b = [
        other.x, other.y,
        other.x, other.bottom,
        other.right, other.bottom,
        other.right, other.y
    ];
    let polygons = [a, b];
    let minA, maxA, projected, minB, maxB, j;

    for (let i = 0; i < polygons.length; i++) {
        let polygon = polygons[i];

        for (let i1 = 0; i1 < polygon.length; i1 += 2) {
            let i2 = (i1 + 2) % polygon.length;
            let normal = {
                x: polygon[i2 + 1] - polygon[i1 + 1],
                y: polygon[i1] - polygon[i2]
            }
            minA = maxA = null;

            for (j = 0; j < a.length; j += 2) {
                projected = normal.x * a[j] + normal.y * a[j + 1];
                if (minA === null || projected < minA) {
                    minA = projected;
                }
                if (maxA === null || projected > maxA) {
                    maxA = projected;
                }
            }

            minB = maxB = null;
            for (j = 0; j < b.length; j += 2) {
                projected = normal.x * b[j] + normal.y * b[j + 1];
                if (minB === null || projected < minB) {
                    minB = projected;
                }
                if (maxB === null || projected > maxB) {
                    maxB = projected;
                }
            }
            if (maxA! < minB! || maxB! < minA!) {
                return false;
            }
        }
    }

    return true;
}