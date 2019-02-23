import axios from 'axios';
import { apiKey } from '../config';
/**
 * Food 2 Fork API info
 * API key - 7a6a0bb3542336e661927eee7ef879cb
 * Get path - https://www.food2fork.com/api/search
 */
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const result = await axios(
        `https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`
      );
      this.result = result.data.recipes;
    } catch (error) {
      throw error;
    }
  }
}
