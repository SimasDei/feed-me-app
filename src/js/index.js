import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

    // #4 Send the API request, await results

    await state.search.getResults();

    // #5 Render results to the UI
    searchView.renderResults(state.search.result);
    clearLoader();
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
 * Search Controller End
 */

/**
 * @controller - Recipe Controller
 */
const controlRecipe = async () => {
  // Get ID from window object. current URL
  const id = window.location.hash.replace('#', '');
  console.log(id);
  if (id) {
    // Prepare UI for changes

    // Create new Recipe Object
    state.recipe = new Recipe(id);

    // Get Recipe Data
    try {
      await state.recipe.getRecipe();
      // Call calculation functions
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render the Recipe
      console.log(state.recipe);
    } catch (error) {
      throw error;
    }
  }
};
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
