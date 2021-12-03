import Collidable from "../../extensions/Collidable";
import Interactable, { IOnInteractCallback } from "../../extensions/Interactable";
import GameBrain from "../../GameBrain";
import Player from "../Player";

export default class Pie extends Interactable {
    protected OnInteract: IOnInteractCallback;
    static readonly VALUE = 10;
    
    constructor() {
        super();
        this.InitEntityView('/assets/entities/pie.json');
        this.OnInteract = this.OnInteractCallback.bind(this);
        
        GameBrain.Instance.EntitiesList.push(this);
    }
    
    Update() {
        if (this.View) {
            this.View.Update();
        }
    }
    
    private OnInteractCallback(entity: Collidable) {
        if (entity instanceof Player) {
            this.Destroy();
            
            const player = entity as Player;
            player.ScoreManager.AddScore(Pie.VALUE);
        }
    }
    
    private Destroy() {
        GameBrain.Instance.EntitiesList.remove(this);
        this.View?.Destroy();
    }
}