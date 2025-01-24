class GameDesigner {
    constructor() {
        this.db = gameDB;
        this.ui = uiManager;
        this.assets = assetManager;
        this.exporter = new ProjectExporter();
        
        this.initializeProject();
        this.loadInitialData();
    }

    async initializeProject() {
        await this.db.initDatabase();
        this.loadDefaultAssets();
        this.setupAutosave();
    }

    async loadInitialData() {
        const initialScenes = await fetch('data/initial-scenes.json')
            .then(res => res.json())
            .catch(() => this.loadOfflineData());
            
        await this.db.saveScene(initialScenes);
        this.ui.populateTreeView(initialScenes);
    }

    setupAutosave() {
        setInterval(() => this.saveProject(), 30000);
    }

    async saveProject() {
        try {
            await this.db.saveToStore('project_state', {
                lastSaved: new Date(),
                version: '1.0'
            });
            this.ui.updateStatus('Project saved');
        } catch (error) {
            this.ui.showError('Autosave failed');
        }
    }
}

// Initialize the application
const gameDesigner = new GameDesigner();
