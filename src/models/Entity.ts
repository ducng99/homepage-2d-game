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
    
    InitEntityView(jsonFilePath: string) {
        EntityView.Load(this, jsonFilePath).then(view => {
            this.View = view;
        });
    }

    abstract Update(...args: any): void;
}