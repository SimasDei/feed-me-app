import axios from 'axios';
/**
 * Food 2 Fork API info
 * API key - 7a6a0bb3542336e661927eee7ef879cb
 * Get path - https://www.food2fork.com/api/search
 */
async function getResults(query) {
  const apiKey = '7a6a0bb3542336e661927eee7ef879cb';
  try {
    const result = await axios(
      `https://www.food2fork.com/api/search?key=${apiKey}&q=${query}`
    );
    const recipes = result.data.recipes;
    console.log(recipes);
  } catch (error) {
    throw error;
  }
}

getResults('cake');
