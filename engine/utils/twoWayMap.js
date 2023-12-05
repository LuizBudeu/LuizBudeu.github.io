class TwoWayMap {
    constructor(entries = []) {
        this.map = new Map(entries);
        this.reverseMap = new Map();

        for (const [key, value] of entries) {
            this.reverseMap.set(value, key);
        }
    }

    get(key) {
        return this.map.get(key);
    }

    revGet(key) {
        return this.reverseMap.get(key);
    }

    set(key, value) {
        this.map.set(key, value);
        this.reverseMap.set(value, key);
    }

    revSet(key, value) {
        this.reverseMap.set(key, value);
        this.map.set(value, key);
    }

    delete(key) {
        const value = this.map.get(key);
        this.map.delete(key);
        this.reverseMap.delete(value);
    }

    revDelete(key) {
        const value = this.reverseMap.get(key);
        this.reverseMap.delete(key);
        this.map.delete(value);
    }

    has(key) {
        return this.map.has(key);
    }

    revHas(key) {
        return this.reverseMap.has(key);
    }

    keys() {
        return [...this.map.keys()];
    }

    revKeys() {
        return [...this.reverseMap.keys()];
    }

    values() {
        return [...this.map.values()];
    }

    revValues() {
        return [...this.reverseMap.values()];
    }

    entries() {
        return [...this.map.entries()];
    }

    revEntries() {
        return [...this.reverseMap.entries()];
    }

    clear() {
        this.map.clear();
        this.reverseMap.clear();
    }
}

export default TwoWayMap;
