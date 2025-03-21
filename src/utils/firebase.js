import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from 'firebase/database';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Saves a score to the global leaderboard
 * @param {string} name - Player name
 * @param {number} score - Player score
 * @returns {Promise} - Promise with the result
 */
export const saveScore = async (name, score) => {
  try {
    const scoresRef = ref(database, 'scores');
    const result = await push(scoresRef, {
      name,
      score,
      date: new Date().toISOString()
    });
    return result;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

/**
 * Gets the top scores from the global leaderboard
 * @param {number} limit - How many scores to get
 * @returns {Promise<Array>} - Promise with array of score objects
 */
export const getTopScores = (limit = 10) => {
  return new Promise((resolve, reject) => {
    const scoresRef = ref(database, 'scores');
    const topScoresQuery = query(
      scoresRef,
      orderByChild('score'),
      limitToLast(limit)
    );
    
    onValue(topScoresQuery, (snapshot) => {
      const scores = [];
      snapshot.forEach((childSnapshot) => {
        scores.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort scores in descending order
      scores.sort((a, b) => b.score - a.score);
      resolve(scores);
    }, (error) => {
      console.error('Error fetching scores:', error);
      reject(error);
    });
  });
};

export default {
  saveScore,
  getTopScores
}; 