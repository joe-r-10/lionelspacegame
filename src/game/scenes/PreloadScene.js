import 'phaser';

/**
 * Preload Scene - Loads all game assets
 */
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create loading text
        const loadingText = this.add.text(400, 300, 'Loading...', {
            font: '32px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5);

        // Create laser texture using graphics
        const laserGraphics = this.add.graphics();
        laserGraphics.lineStyle(2, 0x00ff00);
        laserGraphics.fillStyle(0x00ff00);
        laserGraphics.fillRect(0, 0, 4, 16);
        laserGraphics.generateTexture('laser', 4, 16);
        laserGraphics.destroy();

        // Create tough enemy sprite
        const graphicsTough = this.add.graphics();
        
        // Main body (hexagonal shape)
        graphicsTough.lineStyle(2, 0x00ff00);
        graphicsTough.fillStyle(0x004400);
        graphicsTough.beginPath();
        graphicsTough.moveTo(25, 0);  // Top point
        graphicsTough.lineTo(45, 15); // Top right
        graphicsTough.lineTo(45, 35); // Bottom right
        graphicsTough.lineTo(25, 50); // Bottom point
        graphicsTough.lineTo(5, 35);  // Bottom left
        graphicsTough.lineTo(5, 15);  // Top left
        graphicsTough.closePath();
        graphicsTough.strokePath();
        graphicsTough.fillPath();

        // Armor plates
        graphicsTough.lineStyle(2, 0x00ff00);
        graphicsTough.beginPath();
        graphicsTough.moveTo(15, 15);
        graphicsTough.lineTo(35, 15);
        graphicsTough.moveTo(15, 35);
        graphicsTough.lineTo(35, 35);
        graphicsTough.strokePath();

        // Side wings
        graphicsTough.fillStyle(0x006600);
        graphicsTough.fillRect(0, 20, 5, 10);
        graphicsTough.fillRect(45, 20, 5, 10);

        // Center detail
        graphicsTough.lineStyle(2, 0x00ff00);
        graphicsTough.beginPath();
        graphicsTough.arc(25, 25, 8, 0, Math.PI * 2);
        graphicsTough.strokePath();

        // Generate texture
        graphicsTough.generateTexture('enemy-tough', 50, 50);
        graphicsTough.destroy();

        // Load background assets
        this.load.image('background', 'assets/backgrounds/space-bg.png');
        this.load.image('stars', 'assets/backgrounds/stars.png');

        // Load player assets
        this.load.image('player', 'assets/player/lionel.png');

        // Load enemy assets
        this.load.image('enemy-basic', 'assets/enemies/basic-ship.png');
        this.load.image('enemy-fast', 'assets/enemies/fast-scout.png');
        this.load.image('enemy-boss', 'assets/enemies/boss-ship.png');

        // Load power-up assets
        this.load.image('treat-red', 'assets/powerups/speed-treat.png');
        this.load.image('treat-blue', 'assets/powerups/double-shot-treat.png');
        this.load.image('treat-green', 'assets/powerups/shield-treat.png');
        this.load.image('treat-gold', 'assets/powerups/combo-treat.png');
        
        // Load audio assets
        this.load.audio('laser-sound', 'assets/audio/laser.mp3');
        this.load.audio('explosion-sound', 'assets/audio/explosion.mp3');
        this.load.audio('powerup-sound', 'assets/audio/powerup.mp3');
        this.load.audio('game-over-sound', 'assets/audio/game-over.mp3');
        this.load.audio('background-music', 'assets/audio/background-music.mp3');
    }

    create() {
        this.scene.start('MenuScene');
    }
} 