class UIManager {
    constructor() {
        this.bindElements();
        this.initEventListeners();
        this.loadInitialData();
    }

    bindElements() {
        this.treeView = document.getElementById('treeView');
        this.contentView = document.getElementById('contentView');
        this.editors = {
            scene: document.getElementById('sceneEditor'),
            character: document.getElementById('characterEditor'),
            dialogue: document.getElementById('dialogueEditor'),
            asset: document.getElementById('assetManager')
        };
    }

    initEventListeners() {
        // Tree view interactions
        this.treeView.addEventListener('click', (e) => {
            if (e.target.classList.contains('node-toggle')) {
                this.toggleNode(e.target.parentElement);
            }
            if (e.target.classList.contains('node-title')) {
                this.loadNodeContent(e.target.dataset.nodeId);
            }
        });

        // Auto-save functionality
        document.querySelectorAll('.input-field').forEach(input => {
            input.addEventListener('change', () => this.autoSave());
            input.addEventListener('blur', () => this.autoSave());
        });

        // Offline status handling
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
    }

    async loadInitialData() {
        try {
            const scenes = await gameDB.getAll('scenes');
            const characters = await gameDB.getAll('characters');
            this.populateTreeView(scenes, characters);
        } catch (error) {
            this.showError('Failed to load initial data');
        }
    }

    populateTreeView(scenes, characters) {
        const template = document.getElementById('nodeTemplate');
        
        // Populate Scenes
        const scenesNode = this.createBranchNode('Scenes');
        scenes.forEach(scene => {
            const node = template.content.cloneNode(true);
            node.querySelector('.node-title').textContent = scene.title;
            node.querySelector('.node-title').dataset.nodeId = scene.id;
            scenesNode.appendChild(node);
        });
        this.treeView.appendChild(scenesNode);

        // Populate Characters
        const charactersNode = this.createBranchNode('Characters');
        characters.forEach(character => {
            const node = template.content.cloneNode(true);
            node.querySelector('.node-title').textContent = character.name;
            node.querySelector('.node-title').dataset.nodeId = character.id;
            charactersNode.appendChild(node);
        });
        this.treeView.appendChild(charactersNode);
    }

    createBranchNode(title) {
        const branch = document.createElement('div');
        branch.className = 'tree-branch';
        branch.innerHTML = `
            <div class="branch-header">
                <span class="node-toggle">▶</span>
                <span class="branch-title">${title}</span>
            </div>
            <div class="branch-content"></div>
        `;
        return branch;
    }

    toggleNode(node) {
        node.classList.toggle('expanded');
        const content = node.nextElementSibling;
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }

    async loadNodeContent(nodeId) {
        const spinner = this.showSpinner();
        try {
            const data = await this.fetchNodeData(nodeId);
            this.displayNodeContent(data);
        } catch (error) {
            this.showError('Failed to load content');
        } finally {
            this.hideSpinner(spinner);
        }
    }

    showSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        this.contentView.appendChild(spinner);
        return spinner;
    }

    hideSpinner(spinner) {
        spinner.remove();
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        this.contentView.appendChild(error);
        setTimeout(() => error.remove(), 3000);
    }

    updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';
        document.body.dataset.connectionStatus = status;
        const statusBar = document.getElementById('statusBar');
        statusBar.textContent = `Status: ${status}`;
    }
}

const uiManager = new UIManager();
