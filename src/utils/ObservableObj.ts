export default class ObservableObj<T> {
    constructor(value: T) {
        this._value = value;
    }
    
    private _value: T;
    get Value() { return this._value }

    set Value(value) {
        if (this._value !== value) {
            this._callbacks.forEach(func => func(value));
        }
        
        this._value = value;
    }
    
    private _callbacks: Function[] = [];

    onChange(callback: Function) {
        this._callbacks.push(callback);
    }
}