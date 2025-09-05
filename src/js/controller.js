import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import resultsView from '../views/resultsView.js';
import paginationView from '../views/paginationView.js';
import bookmarksView from '../views/bookmarksView.js';
import addRecipeView from '../views/addRecipeView.js';
import { MODAL_CLOSE_OUT } from './config.js';

const controlRecipes = async function () {
  try {
    recipeView.renderSpinner();
    const id = window.location.hash.slice(1);
    if (!id) {
      recipeView.renderMessage('Please select a recipe to view.');
      return;
    }
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    if (!model.state.search.results) throw new Error('No recipes searched');
    resultsView.update(model.getSearchResultsPerPage());
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.warn(err.message);
    recipeView.renderError(err.message);
  }
};
const controlSearch = async function () {
  let query = searchView.getQuery();
  if (!query) return;
  resultsView.renderSpinner();
  await model.loadSearchResults(query);
  resultsView.render(model.getSearchResultsPerPage(1));
  paginationView.render(model.state.search);
};
const controlPagination = function (page) {
  model.state.search.page = page;
  resultsView.render(model.getSearchResultsPerPage());
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  if (newServings <= 0) return;
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};
const controlBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    setTimeout(() => {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_OUT * 1000);
    addRecipeView.renderMessage('Recipe successfully uploaded. ✔️');
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    console.log(model.state);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log('done');
  } catch (err) {
    console.error(err);
    addRecipeView.renderError('Recipe upload failed. ❌');
  }
};
const initBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// The init function here helps us to add Event handlers using the publisher-subscriber pattern

const init = function () {
  bookmarksView.addHandlerRender(initBookmarks);
  recipeView.addHandler(controlRecipes);
  searchView.addHandler(controlSearch);
  paginationView.addHandler(controlPagination);
  recipeView.addHandlerForServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
