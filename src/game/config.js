/**
 * Phaser Game Configuration
 */
import 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import LeaderboardScene from './scenes/LeaderboardScene';
import HowToPlayScene from './scenes/HowToPlayScene';

// Determine initial scene based on whether the tutorial has been seen
const tutorialSeen = localStorage.getItem('tutorialSeen') === 'true';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000033',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        HowToPlayScene,                           // Include once, can be accessed from menu
        MenuScene,                                // Menu scene comes after
        GameScene,
        LeaderboardScene
    ]
};

// If tutorial has been seen, start at MenuScene instead of HowToPlayScene
if (tutorialSeen) {
    config.scene[2] = MenuScene;
    config.scene[3] = HowToPlayScene;
}

export default config; 