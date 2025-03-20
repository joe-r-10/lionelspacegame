import 'phaser';

/**
 * Leaderboard Scene - Displays game leaderboard
 */
export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }

    create() {
        // Add background
        this.add.tileSprite(400, 300, 800, 600, 'background');
        this.add.tileSprite(400, 300, 800, 600, 'stars');

        // Add title
        const title = this.add.text(400, 50, 'Leaderboard', {
            font: '48px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

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

        // Get local scores and sort by score (highest first)
        const scores = JSON.parse(localStorage.getItem('spaceDogScores') || '[]')
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Only show top 10

        // Create leaderboard container
        const container = this.add.container(400, 200);

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
        this.addTableText('Rank', currentX + 30, -40, columnWidths.rank, headerStyle, container);
        currentX += columnWidths.rank;
        this.addTableText('Name', currentX + 30, -40, columnWidths.name, headerStyle, container);
        currentX += columnWidths.name;
        this.addTableText('Score', currentX + 30, -40, columnWidths.score, headerStyle, container);
        currentX += columnWidths.score;
        this.addTableText('Date', currentX + 30, -40, columnWidths.date, headerStyle, container);

        // Add separator line
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 0.5);
        graphics.lineBetween(startX, 0, -startX, 0);
        container.add(graphics);

        if (scores.length === 0) {
            const noDataText = this.add.text(0, 50, 'No scores yet. Be the first!', {
                font: '24px Arial',
                fill: '#ffffff'
            });
            noDataText.setOrigin(0.5);
            container.add(noDataText);
        } else {
            // Add score entries with improved spacing
            scores.forEach((entry, index) => {
                const y = 40 + (index * 45); // Increased vertical spacing
                const rowStyle = {
                    font: '24px Arial', // Increased font size
                    fill: index === 0 ? '#ffd700' : '#ffffff' // Gold color for top score
                };

                currentX = startX;
                this.addTableText(`${index + 1}.`, currentX + 30, y, columnWidths.rank, rowStyle, container);
                currentX += columnWidths.rank;
                this.addTableText(entry.name, currentX + 30, y, columnWidths.name, rowStyle, container);
                currentX += columnWidths.name;
                this.addTableText(entry.score.toString(), currentX + 30, y, columnWidths.score, rowStyle, container);
                currentX += columnWidths.score;
                this.addTableText(new Date(entry.date).toLocaleDateString(), currentX + 30, y, columnWidths.date, rowStyle, container);
            });
        }
    }

    addTableText(text, x, y, width, style, container) {
        const textObj = this.add.text(x, y, text, style);
        textObj.setFixedSize(width, 0);
        container.add(textObj);
    }
} 