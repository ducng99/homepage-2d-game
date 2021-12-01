declare global {
    interface Array<T> {
        remove(item: T): void;
    }
}

Array.prototype.remove = function (item: any) {
    const index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// Required to make this script a module
export {};