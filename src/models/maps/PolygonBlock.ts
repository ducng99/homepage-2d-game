import * as PIXI from 'pixi.js'
import BlockTypes from './BlockTypes'

export default class PolygonBlock {
    private _polygon: PIXI.Polygon;
    BlockTypes = BlockTypes.None;
    
    constructor(poly: PIXI.Polygon) {
        this._polygon = poly;
    }
    
    get Polygon() { return this._polygon }
}