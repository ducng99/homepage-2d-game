interface Comparer<T> {
    (oldValue: T, value: T): boolean
}

interface Callback<T> {
    (value: T): void
}

export default class Observable<T> {
    private _value: T;
    private _callbacks: Callback<T>[] = [];
    private _comparer?: Comparer<T>;
    
    constructor(value: T, comparer?: Comparer<T>) {
        this._value = value;
        this._comparer = comparer;
    }
    
    get Value() { return this._value }

    set Value(value) {
        const oldValue = this._value;
        this._value = value;
        
        if (this._comparer ? this._comparer(oldValue, value) : (oldValue !== value)) {
            this._callbacks.forEach(func => func(value));
        }
    }

    addListener(callback: Callback<T>) {
        this._callbacks.push(callback);
    }
    
    removeListener(callback: Callback<T>) {
        this._callbacks = this._callbacks.filter(func => func !== callback);
    }
}