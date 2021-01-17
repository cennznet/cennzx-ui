export class Storage<StorageProps> {
    store: any;
    prefix: any;

    constructor(store, prefix) {
        this.store = store;
        if (prefix) {
            this.prefix = `${prefix}_`;
        } else {
            this.prefix = '';
        }
    }

    getPrefixedKey(key) {
        return `${this.prefix}${key}`;
    }

    getItem(key: any) {
        return this.store ? this.store.getItem(this.getPrefixedKey(key)) : null;
    }

    setItem(key, value) {
        this.store ? this.store.setItem(this.getPrefixedKey(key), value) : null;
    }

    removeItem(key) {
        this.store.removeItem(this.getPrefixedKey(key));
    }

    prefixedKeys() {
        const keys = [];
        for (let i = 0, len = this.store.length; i < len; i += 1) {
            const key = this.store.key(i);
            if (key.startsWith(this.prefix)) {
                keys.push(key);
            }
        }
        return keys;
    }

    clear() {
        if (this.prefix === '') {
            this.store.clear();
            return;
        }
        for (const key of this.prefixedKeys()) {
            this.store.removeItem(key);
        }
    }
}

// allow rereact static to prebuild
let localStorageX = null;
let sessionStorageX = null;

try {
    const prefix = 'EV';
    if (typeof window !== 'undefined') {
        localStorageX = new Storage(window.localStorage, prefix);
        sessionStorageX = new Storage(window.sessionStorage, prefix);
    }
} catch {}

export const localStorage = localStorageX;
export const sessionStorage = sessionStorageX;

/*
export const makeLocalStorage = (prefix) => new Storage(window.localStorage, prefix);
export const makeSessionStorage = (prefix) => new Storage(window.sessionStorage, prefix);

export const localStorage = makeLocalStorage(defaultPrefix);
export const sessionStorage = makeSessionStorage(defaultPrefix);*/
