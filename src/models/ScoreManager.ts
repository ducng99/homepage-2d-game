import Observable from "../utils/Observable";

export default class ScoreManager {
    private _score = new Observable(0);
    
    get Score(): Observable<number> {
        return this._score;
    }
    
    AddScore(value: number): void {
        this._score.Value += value;
    }
}