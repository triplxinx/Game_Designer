class GameDatabase {
    constructor() {
        this.dbName = 'GameDesignerDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDatabase();
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                const scenes = db.createObjectStore('scenes', { keyPath: 'id', autoIncrement: true });
                const characters = db.createObjectStore('characters', { keyPath: 'id', autoIncrement: true });
                const dialogue = db.createObjectStore('dialogue', { keyPath: 'id', autoIncrement: true });
                const assets = db.createObjectStore('assets', { keyPath: 'id', autoIncrement: true });

                // Create indexes
                scenes.createIndex('by_timeline', 'timeline');
                characters.createIndex('by_type', 'type');
                dialogue.createIndex('by_character', 'characterId');
                assets.createIndex('by_type', 'type');
            };
        });
    }

    async saveScene(sceneData) {
        return this.saveToStore('scenes', sceneData);
    }

    async saveCharacter(characterData) {
        return this.saveToStore('characters', characterData);
    }

    async saveDialogue(dialogueData) {
        return this.saveToStore('dialogue', dialogueData);
    }

    async saveAsset(assetData) {
        return this.saveToStore('assets', assetData);
    }

    async saveToStore(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

const gameDB = new GameDatabase();
