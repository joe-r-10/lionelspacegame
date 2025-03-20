/**
 * Lionel's Space Adventure - Express Server
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory leaderboard (in a real app, you'd use a database)
let leaderboard = [
    { name: 'Lionel', score: 10000 },
    { name: 'SpaceDog', score: 8500 },
    { name: 'TreatHunter', score: 7200 },
    { name: 'StarPup', score: 6500 },
    { name: 'CosmicCanine', score: 5000 }
];

// API Routes
// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    // Sort leaderboard by score (highest first)
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);
    res.json(sortedLeaderboard);
});

// Add score to leaderboard
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;
    
    // Validate input
    if (!name || !score || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid input. Name and score are required.' });
    }
    
    // Add score to leaderboard
    leaderboard.push({
        name: name,
        score: score
    });
    
    // Sort leaderboard
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Trim leaderboard to top entries
    if (leaderboard.length > config.MAX_LEADERBOARD_ENTRIES) {
        leaderboard = leaderboard.slice(0, config.MAX_LEADERBOARD_ENTRIES);
    }
    
    res.status(201).json({ message: 'Score added to leaderboard' });
});

// Serve the index.html for all other routes (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    console.log(`Visit http://localhost:${config.PORT} to play Lionel's Space Adventure!`);
}); 