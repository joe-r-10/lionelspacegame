import 'phaser';

/**
 * Boot Scene - Initial game setup
 */
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar using graphics
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width/4, height/2 - 30, width/2, 50);
        
        const loadingText = this.add.text(width/2, height/2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        // Loading progress events
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width/4 + 10, height/2 - 20, (width/2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('PreloadScene');
        });
    }

    create() {
        // Scene transition will happen automatically when loading is complete
    }
} 