/**
 * Server configuration for Lionel's Space Adventure
 */

module.exports = {
  // Server port
  PORT: process.env.PORT || 3002,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Leaderboard size
  MAX_LEADERBOARD_ENTRIES: 10,
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // For future database connection
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/lionels-space-adventure'
}; 