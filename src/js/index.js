import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
/**
 * @param {object}  state -
 * saves some current app features
 * @property {object} search -
 * current recipe search object
 *
 */
const state = {};

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

    // #4 Send the API request adn get results, await results
    await state.search.getResults();

    // #5 Render results to the UI
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
