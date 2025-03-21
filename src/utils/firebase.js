import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast, serverTimestamp } from 'firebase/database';

// Firebase configuration for public Space Dog game leaderboard
// No sensitive data here as this is a public leaderboard
const firebaseConfig = {
  apiKey: "AIzaSyDRxWxwioaRIkS5oaJrMlFrgT7ioNPOFfc",
  authDomain: "spacedoggame-public.firebaseapp.com",
  databaseURL: "https://spacedoggame-public-default-rtdb.firebaseio.com",
  projectId: "spacedoggame-public",
  storageBucket: "spacedoggame-public.appspot.com",
  messagingSenderId: "115878278642",
  appId: "1:115878278642:web:15e4a92f348e11fde26bc7"
};

// Debug flag
const DEBUG = true;
const debug = (message, data) => {
  if (DEBUG) {
    if (data) {
      console.log(`[FIREBASE DEBUG] ${message}`, data);
    } else {
      console.log(`[FIREBASE DEBUG] ${message}`);
    }
  }
};

// Initialize Firebase with enhanced error handling
let app;
let database;
let dbInitialized = false;

function initializeFirebase() {
  if (app) {
    debug("Firebase already initialized, skipping initialization");
    return;
  }

  debug("Starting Firebase initialization...");
  try {
    // Initialize the app
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    debug("Firebase core initialized");
    
    // Verify database connection
    const testRef = ref(database, '.info/connected');
    onValue(testRef, (snapshot) => {
      dbInitialized = snapshot.val() === true;
      debug(`Firebase connection status: ${dbInitialized ? "Connected" : "Disconnected"}`);
    });
    
    // Do a simple read operation to verify database access
    const rootRef = ref(database);
    onValue(rootRef, () => {
      debug("Successfully connected to database root");
    }, (error) => {
      debug(`Error connecting to database root: ${error.message}`, error);
    });
    
    debug("Firebase initialization complete");
    return true;
  } catch (error) {
    debug("Firebase initialization error", error);
    console.error("Firebase initialization error:", error);
    return false;
  }
}

// Initialize Firebase when module is imported
initializeFirebase();

/**
 * Saves a score to the global leaderboard
 * @param {string} name - Player name
 * @param {number} score - Player score
 * @returns {Promise} - Promise with the result
 */
export const saveScore = async (name, score) => {
  debug(`Attempting to save score: ${name}, ${score}`);
  
  // If Firebase is not initialized, try to initialize it
  if (!database) {
    debug("Database not initialized, attempting to initialize...");
    if (!initializeFirebase()) {
      debug("Failed to initialize Firebase");
      console.error("Firebase database not initialized and initialization failed");
      return Promise.reject(new Error("Firebase database not initialized"));
    }
  }

  try {
    // Ensure score is a number
    const numericScore = Number(score);
    if (isNaN(numericScore)) {
      debug(`Invalid score format: ${score}`);
      console.error("Invalid score format:", score);
      return Promise.reject(new Error("Score must be a number"));
    }

    // Ensure name is valid
    const playerName = String(name || "Player").trim();
    if (!playerName) {
      debug(`Invalid player name: ${name}`);
      console.error("Invalid player name:", name);
      return Promise.reject(new Error("Player name cannot be empty"));
    }

    // Create score data object
    const scoreData = {
      name: playerName,
      score: numericScore,
      date: new Date().toISOString(),
      timestamp: serverTimestamp()
    };

    debug(`Saving score to Firebase:`, scoreData);
    const scoresRef = ref(database, 'scores');
    const result = await push(scoresRef, scoreData);
    
    debug(`Score saved successfully with key: ${result.key}`);
    console.log("Score saved successfully to Firebase:", result.key);
    return result;
  } catch (error) {
    debug(`Error saving score to Firebase: ${error.message}`, error);
    console.error('Error saving score to Firebase:', error);
    return Promise.reject(error);
  }
};

/**
 * Tests the Firebase connection directly
 * @returns {Promise<boolean>} - Promise that resolves to true if connected
 */
export const testConnection = () => {
  debug("Testing Firebase connection...");
  return new Promise((resolve) => {
    if (!database) {
      debug("Database not initialized, attempting to initialize...");
      if (!initializeFirebase()) {
        debug("Failed to initialize Firebase during connection test");
        resolve(false);
        return;
      }
    }

    const testRef = ref(database, '.info/connected');
    
    // Set a timeout in case onValue never fires
    const timeout = setTimeout(() => {
      debug("Connection test timed out");
      resolve(false);
    }, 5000);
    
    onValue(testRef, (snapshot) => {
      clearTimeout(timeout);
      const isConnected = snapshot.val() === true;
      debug(`Connection test result: ${isConnected ? "Connected" : "Disconnected"}`);
      resolve(isConnected);
    }, (error) => {
      clearTimeout(timeout);
      debug(`Connection test error: ${error.message}`, error);
      resolve(false);
    });
  });
};

/**
 * Gets the top scores from the global leaderboard
 * @param {number} limit - How many scores to get
 * @returns {Promise<Array>} - Promise with array of score objects
 */
export const getTopScores = (limit = 10) => {
  debug(`Fetching top ${limit} scores from Firebase...`);
  
  return new Promise((resolve, reject) => {
    // If Firebase is not initialized, try to initialize it
    if (!database) {
      debug("Database not initialized, attempting to initialize...");
      if (!initializeFirebase()) {
        debug("Failed to initialize Firebase");
        console.error("Firebase database not initialized and initialization failed");
        reject(new Error("Firebase database not initialized"));
        return;
      }
    }

    const scoresRef = ref(database, 'scores');
    const topScoresQuery = query(
      scoresRef,
      orderByChild('score'),
      limitToLast(limit)
    );
    
    // Set timeout for Firebase query
    const timeout = setTimeout(() => {
      debug("Firebase query timed out after 10 seconds");
      console.error("Firebase query timed out after 10 seconds");
      reject(new Error("Firebase query timed out"));
    }, 10000);
    
    onValue(topScoresQuery, (snapshot) => {
      clearTimeout(timeout);
      const scores = [];
      
      try {
        debug(`Raw snapshot received, has children: ${snapshot.exists()}`);
        
        snapshot.forEach((childSnapshot) => {
          const scoreData = childSnapshot.val();
          debug(`Processing score: ${childSnapshot.key}`, scoreData);
          
          scores.push({
            id: childSnapshot.key,
            name: scoreData.name || "Unknown",
            score: Number(scoreData.score) || 0,
            date: scoreData.date || new Date().toISOString()
          });
        });
        
        // Sort scores in descending order
        scores.sort((a, b) => b.score - a.score);
        debug(`Successfully fetched ${scores.length} scores from Firebase`, scores);
        console.log(`Successfully fetched ${scores.length} scores from Firebase`);
        resolve(scores);
      } catch (error) {
        debug(`Error processing score data: ${error.message}`, error);
        console.error("Error processing score data:", error);
        reject(error);
      }
    }, (error) => {
      clearTimeout(timeout);
      debug(`Error fetching scores from Firebase: ${error.message}`, error);
      console.error('Error fetching scores from Firebase:', error);
      reject(error);
    });
  });
};

// Export testConnection as well as the existing functions
export default {
  saveScore,
  getTopScores,
  testConnection
}; 