/**
 * Asset Generator Script - Generates and saves game assets
 */

// Include the asset generator
document.addEventListener('DOMContentLoaded', () => {
    // Function to save data URL as image file
    function saveDataURLToFile(dataURL, filename) {
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Generate assets
    const assets = [
        { name: 'lionel.png', dataURL: window.assetGenerator.drawLionel() },
        { name: 'laser.png', dataURL: window.assetGenerator.drawLaser() },
        { name: 'basic-ship.png', dataURL: window.assetGenerator.drawEnemyBasic() },
        { name: 'fast-scout.png', dataURL: window.assetGenerator.drawEnemyFast() },
        { name: 'boss-ship.png', dataURL: window.assetGenerator.drawEnemyBoss() },
        { name: 'speed-treat.png', dataURL: window.assetGenerator.drawTreat('#FF0000') },
        { name: 'double-shot-treat.png', dataURL: window.assetGenerator.drawTreat('#0000FF') },
        { name: 'shield-treat.png', dataURL: window.assetGenerator.drawTreat('#00FF00') },
        { name: 'combo-treat.png', dataURL: window.assetGenerator.drawTreat('#FFD700') },
        { name: 'space-bg.png', dataURL: window.assetGenerator.drawBackground() },
        { name: 'stars.png', dataURL: window.assetGenerator.drawStars() }
    ];

    // Save assets
    assets.forEach(asset => {
        saveDataURLToFile(asset.dataURL, asset.name);
    });

    // Create a message
    const message = document.createElement('div');
    message.textContent = 'Assets generated! Please save them to the appropriate folders.';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(0, 0, 0, 0.8)';
    message.style.color = '#fff';
    message.style.padding = '20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '9999';
    document.body.appendChild(message);
}); 