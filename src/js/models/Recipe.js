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
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
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
    const units = [...unitsShort, 'kg', 'g'];
    const newIngredients = this.ingredients.map(element => {
      // #1 Uniform Units
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, units[index]);
      });

      // #2 Remove Parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // #3 Parse ingredients into count, unit and ingredient
      const ingredientArray = ingredient.split(' ');
      const unitIndex = ingredientArray.findIndex(element2 =>
        units.includes(element2)
      );

      let objectIngredient;
      if (unitIndex > -1) {
        // Unit Found
        // E.g. 4 cups = [4]
        // E.g. 4 1/2 cups = [4, 1/2] ==> eval("4 + 1/2")
        const arrayCount = ingredientArray.slice(0, unitIndex);
        let count;
        if (arrayCount.length === 1) {
          count = eval(ingredientArray[0].replace('-', '+'));
        } else {
          count = eval(ingredientArray.slice(0, unitIndex).join('+'));
        }
        objectIngredient = {
          count,
          unit: ingredientArray[unitIndex],
          ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(ingredientArray[0], 10)) {
        // No unit, but 1st element is a number
        objectIngredient = {
          count: parseInt(ingredientArray[0], 10),
          unit: '',
          ingredient: ingredientArray.slice(1).join(' ')
        };
      } else if (unitIndex === -1) {
        // No Unit && No number
        objectIngredient = {
          count: 1,
          unit: '',
          ingredient
        };
      }
      return objectIngredient;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ingredient => {
      ingredient.count *= ingredient.count / this.servings;
    });

    this.servings = newServings;
  }
}
