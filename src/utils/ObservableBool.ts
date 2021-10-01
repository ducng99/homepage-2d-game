export default class ObservableBool {
    private _value = false;
    get Value() { return this._value }

    set Value(value) {
        if (this._value !== value) {
            this._callbacks.forEach(func => func());
        }
        
        this._value = value;
    }
    
    private _callbacks: Function[] = [];

    onChange(callback: Function) {
        this._callbacks.push(callback);
    }
}