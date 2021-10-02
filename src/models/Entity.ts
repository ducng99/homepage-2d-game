import Vector2 from "../utils/Vector2";
import EntityView from "../views/EntityView";

export default abstract class Entity {
    private _position: Vector2;
    get Position() {
        return this._position;
    }

    View?: EntityView;

    constructor() {
        this._position = new Vector2(10, 10);
    }

    abstract Update(): void;
}