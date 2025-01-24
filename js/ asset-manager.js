class AssetManager {
    constructor() {
        this.supportedTypes = {
            images: ['image/png', 'image/jpeg', 'image/gif'],
            audio: ['audio/mpeg', 'audio/wav'],
            data: ['application/json']
        };
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.initializeListeners();
    }

    initializeListeners() {
        const dropZone = document.getElementById('assetDropZone');
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    async handleFile(file) {
        if (!this.validateFile(file)) return;
        
        try {
            const buffer = await file.arrayBuffer();
            const asset = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: buffer,
                dateAdded: new Date()
            };
            
            await gameDB.saveAsset(asset);
            this.displayAssetPreview(asset);
        } catch (error) {
            console.error('Asset handling error:', error);
        }
    }

    validateFile(file) {
        const type = this.getFileType(file);
        if (!type) {
            this.showError('Unsupported file type');
            return false;
        }
        if (file.size > this.maxFileSize) {
            this.showError('File too large');
            return false;
        }
        return true;
    }

    getFileType(file) {
        for (const [category, types] of Object.entries(this.supportedTypes)) {
            if (types.includes(file.type)) return category;
        }
        return null;
    }

    displayAssetPreview(asset) {
        const preview = document.createElement('div');
        preview.className = 'asset-preview';
        
        if (asset.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(new Blob([asset.data]));
            preview.appendChild(img);
        } else if (asset.type.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = URL.createObjectURL(new Blob([asset.data]));
            preview.appendChild(audio);
        }
        
        document.getElementById('assetPreviewArea').appendChild(preview);
    }
}

const assetManager = new AssetManager();
