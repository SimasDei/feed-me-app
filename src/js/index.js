import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';
/**
 * @param {object}  state -
 * saves some current app features
 */
const state = {};
window.state = state;

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

    // Highlight Selected Search Item
    if (state.search) searchView.highlightSelected(id);

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
// Handle recipe Button Clicks
elements.recipe.addEventListener('click', event => {
  if (event.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease Button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    // Increase Button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
    // Shopping cart button is clicked, load List Controller
  } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Shopping list Controller
    controlList();
  } else if (event.target.matches('.recipe__love, .recipe__love *')) {
    // Like Controller
    controlLike();
  }
});
/**
 * @controller - Recipe END
 */

['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

/**
 * @controller - Shopping List Controller
 */
const controlList = () => {
  // Create new List if one does not exist
  if (!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach(element => {
    const item = state.list.addItem(
      element.count,
      element.unit,
      element.ingredient
    );
    listView.renderItem(item);
  });
};

// Handle delete and update list item Events
elements.shopping.addEventListener('click', event => {
  const id = event.target.closest('.shopping__item').dataset.itemid;

  // Handle the Delete method
  if (event.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);
    // Update ingredient count
  } else if (event.target.matches('.shopping__count-value')) {
    const val = parseFloat(event.target.value);
    state.list.updateCount(id, val);
  }
});

/**
 * @controller - Shopping List End
 */

/**
 * @controller - Like Controller
 */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // Recipe not yet Liked
  if (!state.likes.isLiked(currentID)) {
    // Add like to the State
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );
    // Toggle the Like Button Style

    // Add like to the UI list
  } else {
    // Recipe has been Liked
    // Remove like from state
    // Toggle Like button style
    // Remove item from UI
  }
};
/**
 * @controller - Like End
 */
window.l = new List();
