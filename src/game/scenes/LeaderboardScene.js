import 'phaser';
import { getTopScores } from '../../utils/firebase';

/**
 * Leaderboard Scene - Displays game leaderboard
 */
export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
        this.isGlobal = true; // Default to global scores
        this.scores = [];
        this.localScores = [];
        this.isLoading = true;
    }

    create() {
        // Add background
        this.add.tileSprite(400, 300, 800, 600, 'background');
        this.add.tileSprite(400, 300, 800, 600, 'stars');

        // Add title
        this.titleText = this.add.text(400, 50, 'Global Leaderboard', {
            font: '48px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        this.titleText.setOrigin(0.5);

        // Create back button
        const backButton = this.add.text(50, 50, '← Back', {
            font: '24px Arial',
            fill: '#ffffff'
        })
        .setInteractive()
        .setOrigin(0, 0.5);

        // Add button hover effect
        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ff0' });
            this.tweens.add({
                targets: backButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#ffffff' });
            this.tweens.add({
                targets: backButton,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Create toggle button
        this.toggleButton = this.add.text(650, 50, 'Switch to Local', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .setOrigin(0.5);

        // Add toggle button effects
        this.toggleButton.on('pointerover', () => {
            this.toggleButton.setStyle({ fill: '#ff0' });
        });

        this.toggleButton.on('pointerout', () => {
            this.toggleButton.setStyle({ fill: '#ffffff' });
        });

        this.toggleButton.on('pointerdown', () => {
            this.isGlobal = !this.isGlobal;
            this.updateLeaderboard();
        });

        // Create leaderboard container
        this.container = this.add.container(400, 200);

        // Show loading message
        this.loadingText = this.add.text(400, 300, 'Loading scores...', {
            font: '28px Arial',
            fill: '#ffffff'
        });
        this.loadingText.setOrigin(0.5);

        // Get local scores
        this.localScores = JSON.parse(localStorage.getItem('spaceDogScores') || '[]')
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Only show top 10

        // Load global scores
        this.loadGlobalScores();
    }

    async loadGlobalScores() {
        try {
            this.scores = await getTopScores(10);
            this.isLoading = false;
            if (this.loadingText) {
                this.loadingText.destroy();
            }
            this.updateLeaderboard();
        } catch (error) {
            console.error('Error loading global scores:', error);
            this.isLoading = false;
            if (this.loadingText) {
                this.loadingText.setText('Could not load global scores. Showing local scores.');
                
                // Auto-switch to local after error
                this.isGlobal = false;
                this.time.delayedCall(1500, () => {
                    this.loadingText.destroy();
                    this.updateLeaderboard();
                });
            }
        }
    }

    updateLeaderboard() {
        // Update title and toggle button
        this.titleText.setText(this.isGlobal ? 'Global Leaderboard' : 'Local Leaderboard');
        this.toggleButton.setText(this.isGlobal ? 'Switch to Local' : 'Switch to Global');

        // Clear existing scores
        this.container.removeAll();

        // Column widths and spacing
        const columnWidths = {
            rank: 80,    // Increased for better spacing
            name: 200,   // Increased for longer names
            score: 150,  // Increased for larger scores
            date: 200    // Increased for full date display
        };

        // Add table headers with more spacing
        const headerStyle = {
            font: '28px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        };

        const startX = -(columnWidths.rank + columnWidths.name + columnWidths.score + columnWidths.date) / 2;

        // Add headers with proper spacing
        let currentX = startX;
        this.addTableText('Rank', currentX + 30, -40, columnWidths.rank, headerStyle, this.container);
        currentX += columnWidths.rank;
        this.addTableText('Name', currentX + 30, -40, columnWidths.name, headerStyle, this.container);
        currentX += columnWidths.name;
        this.addTableText('Score', currentX + 30, -40, columnWidths.score, headerStyle, this.container);
        currentX += columnWidths.score;
        this.addTableText('Date', currentX + 30, -40, columnWidths.date, headerStyle, this.container);

        // Add separator line
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 0.5);
        graphics.lineBetween(startX, 0, -startX, 0);
        this.container.add(graphics);

        // Get correct scores to display
        const displayScores = this.isGlobal ? this.scores : this.localScores;

        if (displayScores.length === 0) {
            const noDataText = this.add.text(0, 50, 'No scores yet. Be the first!', {
                font: '24px Arial',
                fill: '#ffffff'
            });
            noDataText.setOrigin(0.5);
            this.container.add(noDataText);
        } else {
            // Add score entries with improved spacing
            displayScores.forEach((entry, index) => {
                const y = 40 + (index * 45); // Increased vertical spacing
                const rowStyle = {
                    font: '24px Arial', // Increased font size
                    fill: index === 0 ? '#ffd700' : '#ffffff' // Gold color for top score
                };

                currentX = startX;
                this.addTableText(`${index + 1}.`, currentX + 30, y, columnWidths.rank, rowStyle, this.container);
                currentX += columnWidths.rank;
                this.addTableText(entry.name, currentX + 30, y, columnWidths.name, rowStyle, this.container);
                currentX += columnWidths.name;
                this.addTableText(entry.score.toString(), currentX + 30, y, columnWidths.score, rowStyle, this.container);
                currentX += columnWidths.score;
                this.addTableText(new Date(entry.date).toLocaleDateString(), currentX + 30, y, columnWidths.date, rowStyle, this.container);
            });
        }
    }

    addTableText(text, x, y, width, style, container) {
        const textObj = this.add.text(x, y, text, style);
        textObj.setFixedSize(width, 0);
        container.add(textObj);
    }
} 