import 'phaser';

/**
 * Menu Scene - Main game menu
 */
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Add background
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');
        this.stars = this.add.tileSprite(400, 300, 800, 600, 'stars');

        // Create main container
        const mainContainer = this.add.container(400, 300);

        // Add title
        const title = this.add.text(0, -200, "Lionel's Space Adventure", {
            font: '64px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Create preview container
        const previewContainer = this.add.container(0, -100);
        
        // Add character previews
        this.addPreviewItem(previewContainer, -300, 0, 'player', 'Lionel\nYour Space Dog', 1.5);
        this.addPreviewItem(previewContainer, -150, 0, 'enemy-basic', 'Basic Enemy\nLevel 1', 1);
        this.addPreviewItem(previewContainer, 0, 0, 'enemy-fast', 'Fast Enemy\nLevel 2+', 1);
        this.addPreviewItem(previewContainer, 150, 0, 'enemy-tough', 'Tough Enemy\nLevel 3+', 1);
        this.addPreviewItem(previewContainer, 300, 0, 'enemy-boss', 'Boss Enemy\nLevel 5+', 1.5);

        // Add powerup previews
        const powerupY = 80;
        this.addPreviewItem(previewContainer, -225, powerupY, 'treat-red', 'Speed Boost', 0.8);
        this.addPreviewItem(previewContainer, -75, powerupY, 'treat-blue', 'Double Shot', 0.8);
        this.addPreviewItem(previewContainer, 75, powerupY, 'treat-green', 'Shield', 0.8);
        this.addPreviewItem(previewContainer, 225, powerupY, 'treat-gold', 'All Powers', 0.8);

        // Add buttons container
        const buttonContainer = this.add.container(0, 100);

        // Add menu buttons
        const buttonStyle = {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        };

        const playButton = this.add.text(0, 0, 'Play Game', buttonStyle)
            .setOrigin(0.5)
            .setInteractive();

        const howToPlayButton = this.add.text(0, 70, 'How to Play', buttonStyle)
            .setOrigin(0.5)
            .setInteractive();

        const leaderboardButton = this.add.text(0, 140, 'Leaderboard', buttonStyle)
            .setOrigin(0.5)
            .setInteractive();

        buttonContainer.add([playButton, howToPlayButton, leaderboardButton]);

        // Add version number
        const version = this.add.text(380, 280, 'v1.0', {
            font: '16px Arial',
            fill: '#ffffff',
            align: 'right'
        }).setOrigin(1);

        // Add all containers to main container
        mainContainer.add([title, previewContainer, buttonContainer, version]);

        // Add button hover effects
        [playButton, howToPlayButton, leaderboardButton].forEach(button => {
            button.on('pointerover', () => {
                button.setStyle({ fill: '#ff0' });
                this.tweens.add({
                    targets: button,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            });

            button.on('pointerout', () => {
                button.setStyle({ fill: '#ffffff' });
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });
        });

        // Add button click handlers
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        howToPlayButton.on('pointerdown', () => {
            this.scene.start('HowToPlayScene');
        });

        leaderboardButton.on('pointerdown', () => {
            this.scene.start('LeaderboardScene');
        });

        // Add mobile controls info
        if (this.game.globals?.isMobile) {
            const controlsText = this.add.text(400, 500, 'Swipe to move, tap to shoot', {
                font: '20px Arial',
                fill: '#ffffff'
            });
            controlsText.setOrigin(0.5);
        }
    }

    update() {
        // Scroll the stars background
        this.stars.tilePositionY -= 0.5;
    }

    addPreviewItem(container, x, y, sprite, label, scale = 1) {
        const itemContainer = this.add.container(x, y);
        
        const spriteObj = this.add.sprite(0, 0, sprite);
        spriteObj.setScale(scale);
        
        const text = this.add.text(0, 40, label, {
            font: '16px Arial',
            fill: '#ffffff',
            align: 'center'
        });
        text.setOrigin(0.5);
        
        itemContainer.add([spriteObj, text]);
        container.add(itemContainer);
    }
} 