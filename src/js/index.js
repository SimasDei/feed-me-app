import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
/**
 * @param {object}  state -
 * saves some current app features
 */
const state = {};

/**
 * @controller - Search Controller
 * @param {function} controlSearch -
 * take User input and use it to make an axios request to
 * food2fork api
 * render the results to the searchView
 */
const controlSearch = async () => {
  // #1 - Get query from the view | user input
  /**
   * @TODO - implement dynamic query
   * @param {string} query - user input
   */
  const query = searchView.getInput();

  if (query) {
    // #2 new Search Object, add it to State
    state.search = new Search(query);

    // #3 Prepare UI for result (load spinner)
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);

    try {
      // #4 Send the API request, await results
      await state.search.getResults();
      // #5 Render results to the UI
      searchView.renderResults(state.search.result);
      clearLoader();
    } catch (error) {
      clearLoader();
      throw {
        error,
        message: 'Error fetching data from API, might be at API Call Limit'
      };
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
/**
 * @controller - Search End
 */

/**
 * @controller - Recipe Controller
 */
const controlRecipe = async () => {
  // Get ID from window object. current URL
  const id = window.location.hash.replace('#', '');
  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // Create new Recipe Object and parse Ingredients
    state.recipe = new Recipe(id);

    // Get Recipe Data
    try {
      // Get data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Call calculation functions
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render the Recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      throw {
        error,
        message: 'Error fetching Recipe Data, might be at API Call limit'
      };
    }
  }
};
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
/**
 * @controller - Recipe END
 */
