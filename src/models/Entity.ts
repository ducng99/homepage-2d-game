import Vector2 from "../utils/Vector2";

export default abstract class Entity {
    private _position: Vector2;
    get Position() {
        return this._position;
    }

    constructor() {
        this._position = new Vector2(10, 10);
    }
    
    abstract Update(): void;
}