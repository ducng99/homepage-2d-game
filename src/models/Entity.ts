import Vector2 from "../utils/Vector2";
import EntityView from "../views/EntityView";

export default abstract class Entity {
    private _position: Vector2;
    get Position() {
        return this._position;
    }

    View?: EntityView;

    constructor() {
        this._position = new Vector2();
    }
    
    InitEntityView() {
        EntityView.Load(this, '/assets/entities/player.json').then(view => {
            this.View = view;
        });
    }

    abstract Update(...args: any): void;
}