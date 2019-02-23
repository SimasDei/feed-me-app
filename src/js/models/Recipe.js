import axios from 'axios';
import { apiKey, proxy } from '../config';
/**
 * Food 2 Fork API info
 * API key - 7a6a0bb3542336e661927eee7ef879cb
 * Get path - https://www.food2fork.com/api/search
 */
export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(
        `${proxy}https://food2fork.com/api/get?key=${apiKey}&rId=${this.id}`
      );
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.image = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
    } catch (error) {
      throw error;
    }
  }

  calcTime() {
    // Rough estimate of cooking time
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounce',
      'ounces',
      'teaspoon',
      'teaspoons',
      'cups',
      'pounds'
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound'
    ];
    const newIngredients = this.ingredients.map(element => {
      // #1 Uniform Units
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });
      // #2 Remove Parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, '');
      // #3 Parse ingredients into count, unit and ingredient
      return ingredient;
    });
    this.ingredients = newIngredients;
  }
}
