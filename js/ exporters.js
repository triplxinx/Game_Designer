class ProjectExporter {
    constructor() {
        this.exportFormats = ['json', 'zip', 'html'];
    }

    async exportProject(format = 'json') {
        const data = await this.gatherProjectData();
        switch(format) {
            case 'json': return this.exportJSON(data);
            case 'zip': return this.exportZIP(data);
            case 'html': return this.exportHTML(data);
        }
    }

    async gatherProjectData() {
        return {
            scenes: await gameDB.getAll('scenes'),
            characters: await gameDB.getAll('characters'),
            dialogue: await gameDB.getAll('dialogue'),
            assets: await gameDB.getAll('assets')
        };
    }

    exportJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], 
            {type: 'application/json'});
        this.downloadFile(blob, 'game-project.json');
    }

    exportZIP(data) {
        const zip = new JSZip();
        zip.file('project.json', JSON.stringify(data, null, 2));
        
        // Add assets to zip
        data.assets.forEach(asset => {
            zip.file(`assets/${asset.name}`, asset.data);
        });

        zip.generateAsync({type: 'blob'})
            .then(blob => this.downloadFile(blob, 'game-project.zip'));
    }

    exportHTML(data) {
        const template = this.generateHTMLTemplate(data);
        const blob = new Blob([template], {type: 'text/html'});
        this.downloadFile(blob, 'game-project.html');
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
