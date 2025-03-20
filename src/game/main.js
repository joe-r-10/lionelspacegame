import 'phaser';
import config from './config';

/**
 * Space Dog Adventure - Main Game Initialization
 */
window.addEventListener('load', () => {
    // Create the Phaser game instance
    try {
        const game = new Phaser.Game(config);
        
        // Add global game variables
        game.globals = {
            // Game settings
            bgSpeed: 1.5,
            gameSpeed: 1,
            
            // Player stats
            score: 0,
            highScore: 0,
            
            // Game state
            currentLevel: 1,
            lives: 3,
            
            // Device detection
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
        
        // Load high score from local storage if available
        const savedHighScore = localStorage.getItem('spaceDogHighScore');
        if (savedHighScore) {
            game.globals.highScore = parseInt(savedHighScore);
        }

        // Log successful initialization
        console.log('Game initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}); 