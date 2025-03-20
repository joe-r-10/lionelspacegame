/**
 * Asset Generator - Creates game assets using Canvas
 */

// Create a canvas element
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 64;
canvas.height = 64;

// Function to draw Lionel (player character)
function drawLionel() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for player
    canvas.width = 80;
    canvas.height = 80;
    
    // Draw body (brown oval)
    ctx.fillStyle = '#8B4513'; // Brown color for Lionel
    ctx.beginPath();
    ctx.ellipse(40, 50, 25, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw head (round)
    ctx.fillStyle = '#8B4513'; // Brown color
    ctx.beginPath();
    ctx.arc(40, 25, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw ears
    ctx.fillStyle = '#6B3E0B'; // Darker brown
    // Left ear
    ctx.beginPath();
    ctx.ellipse(25, 15, 10, 15, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.ellipse(55, 15, 10, 15, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw face details
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(30, 25, 5, 0, Math.PI * 2);
    ctx.arc(50, 25, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(30, 25, 2, 0, Math.PI * 2);
    ctx.arc(50, 25, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(40, 35, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Add space helmet outline
    ctx.strokeStyle = '#ADD8E6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(40, 30, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw laser
function drawLaser() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for laser
    canvas.width = 8;
    canvas.height = 20;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FF0000');
    gradient.addColorStop(0.5, '#FF6347');
    gradient.addColorStop(1, '#FF0000');
    
    // Draw laser beam
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add glow effect
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw enemy ship
function drawEnemyBasic() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for enemy
    canvas.width = 40;
    canvas.height = 40;
    
    // Draw enemy ship body
    ctx.fillStyle = '#8A2BE2';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(40, 30);
    ctx.lineTo(30, 40);
    ctx.lineTo(10, 40);
    ctx.lineTo(0, 30);
    ctx.closePath();
    ctx.fill();
    
    // Draw cockpit
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(20, 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw details
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(15, 30, 10, 5);
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw fast enemy
function drawEnemyFast() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for enemy
    canvas.width = 30;
    canvas.height = 40;
    
    // Draw enemy ship body
    ctx.fillStyle = '#00CED1';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(30, 25);
    ctx.lineTo(20, 40);
    ctx.lineTo(10, 40);
    ctx.lineTo(0, 25);
    ctx.closePath();
    ctx.fill();
    
    // Draw cockpit
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(15, 15, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw details
    ctx.fillStyle = '#008B8B';
    ctx.fillRect(10, 30, 10, 5);
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw boss enemy
function drawEnemyBoss() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for boss
    canvas.width = 100;
    canvas.height = 100;
    
    // Draw boss ship body
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(90, 30);
    ctx.lineTo(100, 70);
    ctx.lineTo(70, 100);
    ctx.lineTo(30, 100);
    ctx.lineTo(0, 70);
    ctx.lineTo(10, 30);
    ctx.closePath();
    ctx.fill();
    
    // Draw cockpit
    ctx.fillStyle = '#4682B4';
    ctx.beginPath();
    ctx.arc(50, 40, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw details
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(30, 70, 40, 10);
    
    // Draw weapon attachments
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.rect(20, 50, 10, 30);
    ctx.rect(70, 50, 10, 30);
    ctx.fill();
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw treat (powerup)
function drawTreat(color) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for treat
    canvas.width = 30;
    canvas.height = 30;
    
    // Draw bone shape
    ctx.fillStyle = color;
    
    // Left circle
    ctx.beginPath();
    ctx.arc(5, 5, 5, 0, Math.PI * 2);
    ctx.arc(5, 25, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Right circle
    ctx.beginPath();
    ctx.arc(25, 5, 5, 0, Math.PI * 2);
    ctx.arc(25, 25, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Middle rectangle
    ctx.fillRect(5, 10, 20, 10);
    
    // Add glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(15, 15, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw background
function drawBackground() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for background
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000033');
    gradient.addColorStop(1, '#000066');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Function to draw stars
function drawStars() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size for stars
    canvas.width = 800;
    canvas.height = 600;
    
    // Draw 100 stars
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
}

// Export the functions
window.assetGenerator = {
    drawLionel,
    drawLaser,
    drawEnemyBasic,
    drawEnemyFast,
    drawEnemyBoss,
    drawTreat,
    drawBackground,
    drawStars
}; 