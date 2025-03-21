import 'phaser';

export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HowToPlayScene' });
        this.currentPage = 0;
    }

    create() {
        // Add background
        this.add.tileSprite(400, 300, 800, 600, 'background');
        this.add.tileSprite(400, 300, 800, 600, 'stars');

        // Create main container
        this.mainContainer = this.add.container(400, 300);

        // Add title
        const titleContainer = this.add.container(0, -200);
        const title = this.add.text(0, 0, 'How to Play', {
            font: '48px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        titleContainer.add(title);
        this.mainContainer.add(titleContainer);

        // Create pages
        this.pages = [
            this.createControlsPage(),
            this.createCharactersPage(),
            this.createPowerupsPage()
        ];

        // Create navigation container at the bottom
        const navContainer = this.add.container(0, 150);

        // Add navigation buttons
        const buttonStyle = {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 15, y: 8 }
        };

        const prevButton = this.add.text(-300, 0, '← Previous', buttonStyle)
            .setOrigin(0, 0.5)
            .setInteractive();

        const nextButton = this.add.text(300, 0, 'Next →', buttonStyle)
            .setOrigin(1, 0.5)
            .setInteractive();

        // Add page indicators in their own container
        const indicatorContainer = this.add.container(0, 30);
        this.pageIndicators = [];
        for (let i = 0; i < this.pages.length; i++) {
            const indicator = this.add.circle(
                (i - 1) * 30,
                0,
                6,
                0xffffff
            );
            this.pageIndicators.push(indicator);
            indicatorContainer.add(indicator);
        }

        // Add continue button in its own container
        const continueContainer = this.add.container(0, 80);
        const continueButton = this.add.text(0, 0, 'Continue to Game', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive();

        continueContainer.add(continueButton);
        navContainer.add([prevButton, nextButton, indicatorContainer, continueContainer]);
        this.mainContainer.add(navContainer);

        // Add button effects
        [prevButton, nextButton, continueButton].forEach(button => {
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

        // Add button handlers
        prevButton.on('pointerdown', () => {
            this.changePage(-1);
        });

        nextButton.on('pointerdown', () => {
            this.changePage(1);
        });

        continueButton.on('pointerdown', () => {
            localStorage.setItem('tutorialSeen', 'true');
            this.scene.start('MenuScene');
        });

        // Show initial page
        this.showPage(0);
    }

    createControlsPage() {
        const container = this.add.container(0, -50);
        
        // Create separate containers with more vertical spacing
        const controlsContainer = this.add.container(0, -60);
        const objectivesContainer = this.add.container(0, 60);
        
        // Add CONTROLS section
        const controlsTitle = this.add.text(0, -30, 'CONTROLS', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const controlsText = this.add.text(0, 10, [
            'Move: Use ← → arrow keys or mouse/touch',
            'Shooting: Your ship fires automatically'
        ], {
            font: '22px Arial',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        controlsContainer.add([controlsTitle, controlsText]);

        // Add OBJECTIVES section with more spacing
        const objectivesTitle = this.add.text(0, -30, 'OBJECTIVES', {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        const objectivesText = this.add.text(0, 30, [
            '• Survive waves of increasingly difficult enemies',
            '• Collect power-ups to enhance your abilities',
            '• Progress through levels by destroying enemies',
            '• Achieve the highest score possible',
            '',
            'Each level brings stronger and faster enemies!',
            'Watch out for boss enemies every 5 levels!'
        ], {
            font: '20px Arial',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 12
        }).setOrigin(0.5);

        objectivesContainer.add([objectivesTitle, objectivesText]);
        container.add([controlsContainer, objectivesContainer]);
        
        return container;
    }

    createCharactersPage() {
        const container = this.add.container(0, -50);
        
        // Add title with more space
        const titleContainer = this.add.container(0, -100);
        const title = this.add.text(0, 0, 'CHARACTERS', {
            font: '32px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        titleContainer.add(title);
        
        // Create grid container with more spacing
        const gridContainer = this.add.container(0, 20);
        
        const characters = [
            { sprite: 'player', text: 'Lionel\nYour Space Dog', scale: 1.5 },
            { sprite: 'enemy-basic', text: 'Basic Enemy\nLevel 1\n1 Hit Point', scale: 1.2 },
            { sprite: 'enemy-fast', text: 'Fast Enemy\nLevel 2+\nQuick but fragile', scale: 1.2 },
            { sprite: 'enemy-tough', text: 'Tough Enemy\nLevel 3+\n3 Hit Points', scale: 1.2 },
            { sprite: 'enemy-boss', text: 'Boss Enemy\nLevel 5+\n5 Hit Points', scale: 1.2 }
        ];

        characters.forEach((char, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const itemContainer = this.add.container(
                -200 + col * 200,
                row * 90
            );
            
            const sprite = this.add.sprite(-30, 0, char.sprite);
            sprite.setScale(char.scale);
            
            const text = this.add.text(30, 0, char.text, {
                font: '16px Arial',
                fill: '#ffffff',
                align: 'left',
                lineSpacing: 5
            }).setOrigin(0, 0.5);
            
            itemContainer.add([sprite, text]);
            gridContainer.add(itemContainer);
        });

        container.add([titleContainer, gridContainer]);
        return container;
    }

    createPowerupsPage() {
        const container = this.add.container(0, -50);
        
        // Add title with more space
        const titleContainer = this.add.container(0, -100);
        const title = this.add.text(0, 0, 'POWER-UPS', {
            font: '32px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        titleContainer.add(title);
        
        // Create grid container with more spacing
        const gridContainer = this.add.container(0, 20);
        
        const powerups = [
            { sprite: 'treat-red', text: 'Speed Boost\nFaster movement & firing rate' },
            { sprite: 'treat-blue', text: 'Double Shot\nFire two lasers at once' },
            { sprite: 'treat-green', text: 'Shield\nProtects from one hit' },
            { sprite: 'treat-gold', text: 'All Powers\nActivates all power-ups' }
        ];

        powerups.forEach((powerup, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const itemContainer = this.add.container(
                -150 + col * 300,
                -20 + row * 100
            );
            
            const sprite = this.add.sprite(-40, 0, powerup.sprite);
            sprite.setScale(1.2);
            
            const text = this.add.text(20, 0, powerup.text, {
                font: '18px Arial',
                fill: '#ffffff',
                align: 'left',
                lineSpacing: 5
            }).setOrigin(0, 0.5);
            
            itemContainer.add([sprite, text]);
            gridContainer.add(itemContainer);
        });

        container.add([titleContainer, gridContainer]);
        return container;
    }

    changePage(delta) {
        const newPage = (this.currentPage + delta + this.pages.length) % this.pages.length;
        this.showPage(newPage);
    }

    showPage(pageIndex) {
        // Hide all pages
        this.pages.forEach(page => {
            page.setVisible(false);
            this.mainContainer.remove(page);
        });

        // Show selected page
        this.pages[pageIndex].setVisible(true);
        this.mainContainer.add(this.pages[pageIndex]);
        this.currentPage = pageIndex;

        // Update page indicators
        this.pageIndicators.forEach((indicator, index) => {
            indicator.setFillStyle(index === pageIndex ? 0xffff00 : 0xffffff);
        });
    }
} 