import 'phaser';

/**
 * Game Scene - Main gameplay scene
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Initialize game variables if not already set
        if (!this.game.globals) {
            this.game.globals = {
                score: 0,
                lives: 3,
                currentLevel: 1,
                highScore: parseInt(localStorage.getItem('spaceDogHighScore')) || 0,
                isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            };
        } else {
            // Reset game state for new game
            this.game.globals.score = 0;
            this.game.globals.lives = 3;
            this.game.globals.currentLevel = 1;
        }

        // Game state
        this.isPaused = false;
        this.isCountingDown = false;
        this.isGameOver = false;
        this.powerupStates = {
            speedBoost: { active: false, duration: 0, maxDuration: 10000 },
            doubleShot: { active: false, duration: 0, maxDuration: 15000 },
            shield: { active: false, duration: 0, maxDuration: 8000 }
        };

        // Player movement settings
        this.targetX = 400;
        this.moveSpeed = 300;
        this.baseSpeed = 300;
        this.boostSpeed = 500;
        this.keyboardMovement = false; // Flag to track if keyboard is being used

        // Level progression settings
        this.enemySpawnDelay = 2000;
        this.enemySpeed = 200;
        this.scoreForNextLevel = 1000;
        this.enemiesDestroyed = 0;

        // Add background (static) and stars (scrolling)
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');
        this.stars = this.add.tileSprite(400, 300, 800, 600, 'stars');
        this.backgroundScrolling = true;

        // Create player at bottom of screen
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);

        // Create groups for game objects
        this.lasers = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.powerups = this.physics.add.group();

        // Set up controls
        if (this.game.globals.isMobile) {
            this.setupMobileControls();
        } else {
            this.setupDesktopControls();
        }
        
        // Set up keyboard controls
        this.setupKeyboardControls();

        // Set up UI
        this.setupUI();
        this.setupPowerupUI();

        // Start spawning enemies and powerups
        this.startSpawning();

        // Add pause button
        this.setupPauseButton();

        // Start background music
        this.sound.play('background-music', { loop: true });

        // Set up auto-shooting
        this.lastShotTime = 0;
        this.baseFireRate = 500; // Default fire rate (2 shots per second)
        this.currentFireRate = this.baseFireRate;
        this.autoShootTimer = this.time.addEvent({
            delay: this.currentFireRate,
            callback: this.shoot,
            callbackScope: this,
            loop: true
        });
    }

    setupPowerupUI() {
        // Create powerup UI container
        this.powerupUI = this.add.container(10, 150);

        // Create UI elements for each powerup
        const powerupTypes = [
            { key: 'speedBoost', color: 0xff0000, label: 'Speed' },
            { key: 'doubleShot', color: 0x0000ff, label: 'Double Shot' },
            { key: 'shield', color: 0x00ff00, label: 'Shield' }
        ];

        powerupTypes.forEach((type, index) => {
            const y = index * 60;
            
            // Background
            const bg = this.add.graphics();
            bg.fillStyle(0x000000, 0.5);
            bg.fillRoundedRect(0, y, 100, 50, 5);
            
            // Label
            const text = this.add.text(5, y + 5, type.label, {
                font: '14px Arial',
                fill: '#ffffff'
            });
            
            // Progress bar background
            const barBg = this.add.graphics();
            barBg.fillStyle(0x333333, 1);
            barBg.fillRect(5, y + 25, 90, 10);
            
            // Progress bar
            const bar = this.add.graphics();
            bar.fillStyle(type.color, 1);
            
            this.powerupUI.add([bg, text, barBg, bar]);
            this.powerupStates[type.key].bar = bar;
        });
    }

    updatePowerupUI() {
        Object.entries(this.powerupStates).forEach(([key, powerup], index) => {
            const y = index * 60 + 25;
            powerup.bar.clear();
            if (powerup.active) {
                const width = (powerup.duration / powerup.maxDuration) * 90;
                powerup.bar.fillStyle(key === 'speedBoost' ? 0xff0000 : key === 'doubleShot' ? 0x0000ff : 0x00ff00, 1);
                powerup.bar.fillRect(5, y, width, 10);
            }
        });
    }

    setupMobileControls() {
        // Touch controls - player moves horizontally only
        this.input.on('pointermove', (pointer) => {
            if (!this.isPaused && pointer.isDown) {
                this.targetX = Phaser.Math.Clamp(pointer.x, 0, 800);
            }
        });
    }

    setupDesktopControls() {
        // Mouse movement - horizontal only
        this.input.on('pointermove', (pointer) => {
            if (!this.isPaused) {
                this.targetX = Phaser.Math.Clamp(pointer.x, 0, 800);
            }
        });
    }

    setupKeyboardControls() {
        // Set up cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setupPauseButton() {
        // Create pause button
        const pauseButton = this.add.container(750, 30);
        const pauseBg = this.add.graphics();
        pauseBg.fillStyle(0x000000, 0.5);
        pauseBg.fillRoundedRect(-40, -20, 80, 40, 10);
        const pauseText = this.add.text(0, 0, 'Pause', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        pauseButton.add([pauseBg, pauseText]);
        pauseButton.setSize(80, 40);
        pauseButton.setInteractive();

        // Add hover effect
        pauseButton.on('pointerover', () => {
            pauseBg.clear();
            pauseBg.fillStyle(0x444444, 0.7);
            pauseBg.fillRoundedRect(-40, -20, 80, 40, 10);
        });

        pauseButton.on('pointerout', () => {
            pauseBg.clear();
            pauseBg.fillStyle(0x000000, 0.5);
            pauseBg.fillRoundedRect(-40, -20, 80, 40, 10);
        });

        // Add click handler
        pauseButton.on('pointerdown', () => {
            this.togglePause();
        });

        // Add keyboard pause
        this.input.keyboard.on('keydown-P', () => {
            this.togglePause();
        });
    }

    togglePause() {
        if (this.isCountingDown) return;

        if (!this.isPaused) {
            // Pause the game
            this.isPaused = true;
            this.physics.pause();
            this.time.paused = true;

            // Show pause overlay
            const overlay = this.add.graphics();
            overlay.fillStyle(0x000000, 0.5);
            overlay.fillRect(0, 0, 800, 600);
            overlay.setScrollFactor(0);
            this.pauseOverlay = overlay;

            // Create pause menu container
            const menuContainer = this.add.container(400, 300);
            
            const pauseText = this.add.text(0, -100, 'PAUSED', {
                font: '48px Arial',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            const resumeText = this.add.text(0, 0, 'Resume Game', {
                font: '32px Arial',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            const mainMenuText = this.add.text(0, 60, 'Main Menu', {
                font: '32px Arial',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            menuContainer.add([pauseText, resumeText, mainMenuText]);
            this.pauseMenu = menuContainer;

            // Add click handlers
            resumeText.on('pointerdown', () => {
                this.startResumeCountdown();
            });

            mainMenuText.on('pointerdown', () => {
                this.transitionToScene('MenuScene');
            });

        } else {
            this.startResumeCountdown();
        }
    }

    startResumeCountdown() {
        // Start countdown before resuming
        this.isCountingDown = true;
        const countdownText = this.add.text(400, 200, 'Resuming in 3...', {
            font: '48px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        let count = 3;
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownText.setText(`Resuming in ${count}...`);
            } else {
                clearInterval(countdownInterval);
                // Resume the game
                this.isPaused = false;
                this.isCountingDown = false;
                this.physics.resume();
                this.time.paused = false;
                this.pauseOverlay.destroy();
                this.pauseMenu.destroy();
                countdownText.destroy();
            }
        }, 1000);
    }

    shoot() {
        if (this.isPaused || this.isGameOver) return;

        if (this.powerupStates.doubleShot.active) {
            // Double shot
            this.lasers.create(this.player.x - 20, this.player.y, 'laser').setVelocityY(-400);
            this.lasers.create(this.player.x + 20, this.player.y, 'laser').setVelocityY(-400);
        } else {
            // Single shot
            this.lasers.create(this.player.x, this.player.y, 'laser').setVelocityY(-400);
        }
        this.sound.play('laser-sound', { volume: 0.3 });
    }

    startSpawning() {
        // Spawn enemies periodically
        this.enemySpawnTimer = this.time.addEvent({
            delay: this.enemySpawnDelay,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        // Spawn powerups periodically
        this.powerupSpawnTimer = this.time.addEvent({
            delay: 5000,
            callback: this.spawnPowerup,
            callbackScope: this,
            loop: true
        });
    }

    spawnEnemy() {
        if (this.isGameOver) return;

        // Add buffer to prevent spawning outside player's range
        const buffer = 50;
        const x = Phaser.Math.Between(buffer, 800 - buffer);
        
        // Define enemy types based on level
        let enemyType = 'enemy-basic';
        let enemySpeed = this.enemySpeed;
        let enemyHealth = 1;
        
        // Determine enemy type based on level
        if (this.game.globals.currentLevel >= 5 && Math.random() < 0.1) {
            // 10% chance for boss enemy at level 5+
            enemyType = 'enemy-boss';
            enemySpeed *= 0.7; // Slower
            enemyHealth = 5;
        } else if (this.game.globals.currentLevel >= 3 && Math.random() < 0.3) {
            // 30% chance for tough enemy at level 3+
            enemyType = 'enemy-tough';
            enemySpeed *= 0.8;
            enemyHealth = 3;
        } else if (this.game.globals.currentLevel >= 2 && Math.random() < 0.4) {
            // 40% chance for fast enemy at level 2+
            enemyType = 'enemy-fast';
            enemySpeed *= 1.5;
            enemyHealth = 1;
        }

        // Create enemy with properties
        const enemy = this.enemies.create(x, -50, enemyType);
        enemy.setVelocityY(enemySpeed);
        enemy.health = enemyHealth;
        
        // Add visual effects based on enemy type
        switch (enemyType) {
            case 'enemy-boss':
                enemy.setScale(2);
                enemy.setTint(0xff0000);
                break;
            case 'enemy-tough':
                enemy.setScale(1.5);
                enemy.setTint(0x00ff00);
                break;
            case 'enemy-fast':
                enemy.setTint(0x0000ff);
                break;
        }
    }

    spawnPowerup() {
        const x = Phaser.Math.Between(0, 800);
        const powerupTypes = ['treat-red', 'treat-blue', 'treat-green', 'treat-gold'];
        const type = Phaser.Math.RND.pick(powerupTypes);
        const powerup = this.powerups.create(x, -50, type);
        powerup.setVelocityY(150);
    }

    showPowerupText(text, color) {
        const powerupText = this.add.text(this.player.x, this.player.y - 50, text, {
            font: '20px Arial',
            fill: color
        });
        powerupText.setOrigin(0.5);

        this.tweens.add({
            targets: powerupText,
            y: powerupText.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => powerupText.destroy()
        });
    }

    activateSpeedBoost() {
        // Clear any existing speed boost
        if (this.powerupStates.speedBoost.active) {
            this.moveSpeed = this.baseSpeed;
            this.currentFireRate = this.baseFireRate;
        }
        this.powerupStates.speedBoost.active = true;
        this.powerupStates.speedBoost.duration = this.powerupStates.speedBoost.maxDuration;
        this.moveSpeed = this.boostSpeed;
        
        // Increase fire rate with speed boost
        this.currentFireRate = this.baseFireRate / 2;
        this.autoShootTimer.destroy();
        this.autoShootTimer = this.time.addEvent({
            delay: this.currentFireRate,
            callback: this.shoot,
            callbackScope: this,
            loop: true
        });
        
        this.player.setTint(0xff0000);
        this.showPowerupText('Speed Boost!', '#ff0000');
    }

    activateDoubleShot() {
        // Clear any existing double shot
        this.powerupStates.doubleShot.active = true;
        this.powerupStates.doubleShot.duration = this.powerupStates.doubleShot.maxDuration;
        this.player.setTint(0x0000ff);
        this.showPowerupText('Double Shot!', '#0000ff');
    }

    activateShield() {
        // Clear any existing shield
        if (this.shieldSprite) {
            this.shieldSprite.destroy();
        }
        
        this.powerupStates.shield.active = true;
        this.powerupStates.shield.duration = this.powerupStates.shield.maxDuration;
        
        // Create shield as a horizontal line above player
        this.shieldSprite = this.add.graphics();
        this.shieldSprite.lineStyle(4, 0x00ff00, 1);
        this.shieldSprite.lineBetween(-50, 0, 50, 0);
        
        this.player.setTint(0x00ff00);
        this.showPowerupText('Shield Active!', '#00ff00');
    }

    activateCombo() {
        this.showPowerupText('All Power-ups!', '#ffff00');
        this.player.setTint(0xffff00); // Gold tint for combo
        
        // Activate all powerups with fresh durations
        this.activateSpeedBoost();
        this.activateDoubleShot();
        this.activateShield();
    }

    updatePowerups(delta) {
        let activePowerups = 0;
        Object.entries(this.powerupStates).forEach(([key, powerup]) => {
            if (powerup.active) {
                activePowerups++;
                powerup.duration -= delta;
                if (powerup.duration <= 0) {
                    powerup.active = false;
                    if (key === 'speedBoost') {
                        this.moveSpeed = this.baseSpeed;
                        this.currentFireRate = this.baseFireRate;
                        // Reset fire rate
                        this.autoShootTimer.destroy();
                        this.autoShootTimer = this.time.addEvent({
                            delay: this.currentFireRate,
                            callback: this.shoot,
                            callbackScope: this,
                            loop: true
                        });
                    } else if (key === 'shield' && this.shieldSprite) {
                        this.shieldSprite.destroy();
                    }
                }
            }
        });

        // Update player tint based on active powerups
        if (activePowerups === 0) {
            this.player.clearTint();
        } else if (activePowerups === 3) {
            this.player.setTint(0xffff00); // Gold for all powerups
        }
    }

    collectPowerup(player, powerup) {
        powerup.destroy();
        this.sound.play('powerup-sound', { volume: 0.4 });
        
        // Apply powerup effect based on type
        switch (powerup.texture.key) {
            case 'treat-red':
                this.activateSpeedBoost();
                break;
            case 'treat-blue':
                this.activateDoubleShot();
                break;
            case 'treat-green':
                this.activateShield();
                break;
            case 'treat-gold':
                this.activateCombo();
                break;
        }
    }

    checkLevelProgression() {
        // Progress to next level every 1000 points (10 enemies)
        if (this.game.globals.score >= this.scoreForNextLevel) {
            this.game.globals.currentLevel++;
            this.scoreForNextLevel += 1000;

            // Show level up message
            const levelUpText = this.add.text(400, 300, `Level ${this.game.globals.currentLevel}!`, {
                font: '48px Arial',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6
            });
            levelUpText.setOrigin(0.5);

            // Fade out and destroy the text
            this.tweens.add({
                targets: levelUpText,
                alpha: 0,
                y: 250,
                duration: 2000,
                onComplete: () => levelUpText.destroy()
            });

            // Increase difficulty
            this.enemySpawnDelay = Math.max(500, 2000 - (this.game.globals.currentLevel - 1) * 200);
            this.enemySpeed = Math.min(400, 200 + (this.game.globals.currentLevel - 1) * 30);

            // Update spawn timer
            this.enemySpawnTimer.destroy();
            this.enemySpawnTimer = this.time.addEvent({
                delay: this.enemySpawnDelay,
                callback: this.spawnEnemy,
                callbackScope: this,
                loop: true
            });
        }
    }

    hitEnemy(laser, enemy) {
        laser.destroy();
        
        // Reduce enemy health
        enemy.health--;
        
        if (enemy.health <= 0) {
            enemy.destroy();
            this.sound.play('explosion-sound', { volume: 0.3 });
            
            // Award points based on enemy type
            let points = 100;
            if (enemy.texture.key === 'enemy-boss') {
                points = 500;
                this.showBossDefeatedMessage();
            } else if (enemy.texture.key === 'enemy-tough') {
                points = 300;
            } else if (enemy.texture.key === 'enemy-fast') {
                points = 200;
            }
            
            this.game.globals.score += points;
            this.enemiesDestroyed++;
            this.checkLevelProgression();
        } else {
            // Flash enemy when hit but not destroyed
            this.tweens.add({
                targets: enemy,
                alpha: 0.5,
                duration: 50,
                yoyo: true
            });
        }
    }

    showBossDefeatedMessage() {
        const bossText = this.add.text(400, 300, 'Boss Defeated!', {
            font: '48px Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        });
        bossText.setOrigin(0.5);
        
        this.tweens.add({
            targets: bossText,
            alpha: 0,
            y: 250,
            duration: 2000,
            onComplete: () => bossText.destroy()
        });
    }

    hitPlayer(player, enemy) {
        enemy.destroy();
        this.sound.play('explosion-sound', { volume: 0.3 });

        if (!this.powerupStates.shield.active) {
            this.game.globals.lives--;
            
            if (this.game.globals.lives <= 0) {
                this.gameOver();
            } else {
                // Flash player when hit
                this.tweens.add({
                    targets: player,
                    alpha: 0,
                    duration: 100,
                    yoyo: true,
                    repeat: 3
                });
            }
        } else {
            // Destroy shield on hit
            if (this.shieldSprite) {
                this.shieldSprite.destroy();
            }
            this.powerupStates.shield.active = false;
            this.powerupStates.shield.duration = 0;
            this.player.clearTint();
        }
    }

    gameOver() {
        this.isGameOver = true;
        
        // Stop all game mechanics
        this.physics.pause();
        this.enemySpawnTimer.destroy();
        this.powerupSpawnTimer.destroy();
        this.autoShootTimer.destroy();
        
        // Stop all existing tweens
        this.tweens.killAll();
        
        // Reset and stop background
        this.background.setTilePosition(0, 0);
        this.stars.setTilePosition(0, 0);
        this.backgroundScrolling = false;
        
        // Remove pause button
        if (this.pauseButton) {
            this.pauseButton.destroy();
        }
        
        // Stop all sounds
        this.sound.stopAll();
        this.sound.play('game-over-sound', { volume: 0.4 });
        
        // Save high score
        if (this.game.globals.score > this.game.globals.highScore) {
            this.game.globals.highScore = this.game.globals.score;
            localStorage.setItem('spaceDogHighScore', this.game.globals.highScore);
        }

        // Show game over screen
        const gameOverText = this.add.text(400, 150, 'Game Over', {
            font: '64px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);

        const scoreText = this.add.text(400, 230, `Final Score: ${this.game.globals.score}`, {
            font: '32px Arial',
            fill: '#ffffff'
        });
        scoreText.setOrigin(0.5);

        const levelText = this.add.text(400, 270, `Level Reached: ${this.game.globals.currentLevel}`, {
            font: '32px Arial',
            fill: '#ffffff'
        });
        levelText.setOrigin(0.5);

        // Create name input for leaderboard
        const nameText = this.add.text(400, 320, 'Enter your name:', {
            font: '24px Arial',
            fill: '#ffffff'
        });
        nameText.setOrigin(0.5);

        // Create input box (simulated with a text object)
        const inputBox = this.add.rectangle(400, 360, 300, 40, 0x000000, 0.7);
        const inputText = this.add.text(400, 360, '', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        inputText.setOrigin(0.5);

        // Add a blinking cursor
        const cursor = this.add.text(inputText.x + inputText.width / 2 + 5, inputText.y, '|', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        cursor.setOrigin(0.5);
        
        // Blink the cursor
        this.time.addEvent({
            delay: 500,
            callback: () => {
                cursor.visible = !cursor.visible;
            },
            loop: true
        });

        // Enable keyboard input
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 8 && inputText.text.length > 0) {
                // Backspace
                inputText.text = inputText.text.substr(0, inputText.text.length - 1);
            } else if (event.keyCode === 13 && inputText.text.length > 0) {
                // Enter
                this.submitScore(inputText.text, this.game.globals.score);
            } else if (event.keyCode >= 65 && event.keyCode <= 90 || 
                       event.keyCode >= 48 && event.keyCode <= 57 || 
                       event.keyCode === 32) {
                // Letters, numbers, space
                if (inputText.text.length < 15) {
                    inputText.text += event.key;
                }
            }
            
            // Update cursor position
            cursor.x = inputText.x + (inputText.width / 2) + 5;
        });

        // Submit score button
        const submitButton = this.add.text(400, 420, 'Submit Score', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        submitButton.on('pointerdown', () => {
            if (inputText.text.length > 0) {
                this.submitScore(inputText.text, this.game.globals.score);
            }
        });

        // Play again button
        const restartButton = this.add.text(400, 480, 'Play Again', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Main menu button
        const mainMenuButton = this.add.text(400, 540, 'Main Menu', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        mainMenuButton.on('pointerdown', () => {
            this.transitionToScene('MenuScene');
        });
    }

    async submitScore(name, score) {
        try {
            // For now, just store locally since we don't have a backend
            const scores = JSON.parse(localStorage.getItem('spaceDogScores') || '[]');
            scores.push({ name, score, date: new Date().toISOString() });
            scores.sort((a, b) => b.score - a.score);
            localStorage.setItem('spaceDogScores', JSON.stringify(scores.slice(0, 10))); // Keep top 10

            // Show success message
            const successText = this.add.text(400, 580, 'Score saved!', {
                font: '20px Arial',
                fill: '#00FF00'
            });
            successText.setOrigin(0.5);
            
            // Start menu scene after a short delay
            this.time.delayedCall(1500, () => {
                this.transitionToScene('MenuScene');
            });
        } catch (error) {
            console.error('Error saving score:', error);
            
            // Show error message
            const errorText = this.add.text(400, 580, 'Could not save score.', {
                font: '20px Arial',
                fill: '#FF0000'
            });
            errorText.setOrigin(0.5);
        }
    }

    update(time, delta) {
        if (this.isPaused || this.isGameOver) return;

        // Handle keyboard controls
        if (this.cursors.left.isDown) {
            this.keyboardMovement = true;
            this.targetX = this.player.x - (this.moveSpeed * delta / 1000) * 2;
        } else if (this.cursors.right.isDown) {
            this.keyboardMovement = true;
            this.targetX = this.player.x + (this.moveSpeed * delta / 1000) * 2;
        } else if (this.keyboardMovement) {
            this.keyboardMovement = false;
        }

        // Clamp the target position within the screen bounds
        this.targetX = Phaser.Math.Clamp(this.targetX, this.player.width / 2, 800 - this.player.width / 2);

        // Move the player toward the target position
        const dx = this.targetX - this.player.x;
        if (Math.abs(dx) > 1) {
            this.player.x += dx * 0.2;
        } else {
            this.player.x = this.targetX;
        }

        // Scroll the stars background
        if (this.backgroundScrolling) {
            this.stars.tilePositionY -= 0.5;
        }

        // Update powerups
        this.updatePowerups(delta);
        this.updatePowerupUI();

        // Update shield position if active
        if (this.shieldSprite && this.powerupStates.shield.active) {
            this.shieldSprite.x = this.player.x;
            this.shieldSprite.y = this.player.y - 40; // Position shield higher above player
        }

        // Check collisions
        this.physics.overlap(this.lasers, this.enemies, this.hitEnemy, null, this);
        this.physics.overlap(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.overlap(this.player, this.powerups, this.collectPowerup, null, this);

        // Update score and level
        this.scoreText.setText('Score: ' + this.game.globals.score);
        this.livesText.setText('Lives: ' + this.game.globals.lives);
        this.levelText.setText('Level: ' + this.game.globals.currentLevel);

        // Clean up off-screen objects
        this.cleanupOffscreenObjects();
    }

    cleanupOffscreenObjects() {
        // Remove lasers that have gone off screen
        this.lasers.getChildren().forEach(laser => {
            if (laser.y < -50) laser.destroy();
        });

        // Remove enemies that have gone off screen
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y > 650) enemy.destroy();
        });

        // Remove powerups that have gone off screen
        this.powerups.getChildren().forEach(powerup => {
            if (powerup.y > 650) powerup.destroy();
        });
    }

    setupUI() {
        // Score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            font: '32px Arial',
            fill: '#ffffff'
        });

        // Lives display
        this.livesText = this.add.text(16, 50, 'Lives: 3', {
            font: '32px Arial',
            fill: '#ffffff'
        });

        // Level display
        this.levelText = this.add.text(16, 84, 'Level: 1', {
            font: '32px Arial',
            fill: '#ffffff'
        });
    }

    // Add this method to handle scene transitions
    transitionToScene(sceneName) {
        if (this.scene.manager.getScene(sceneName)) {
            this.scene.start(sceneName);
        } else {
            // Fallback to restarting the game if scene isn't available
            this.scene.start('GameScene');
            console.warn(`Scene '${sceneName}' not found, restarting game instead.`);
        }
    }
} 