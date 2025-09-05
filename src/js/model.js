import addRecipeView from '../views/addRecipeView';
import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
export const createRecipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
  const { recipe } = data.data;
  state.recipe = createRecipeObject(recipe);
  if (state.bookmarks.some(bookmark => bookmark.id === recipe.id))
    state.recipe.bookmarked = true;
  else state.recipe.bookmarked = false;
};
export const loadSearchResults = async function (query) {
  const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
  state.search.query = query;
  console.log(data.data.recipes);
  state.search.results = data.data.recipes.map(recipe => {
    return {
      title: recipe.title,
      id: recipe.id,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    };
  });
  state.search.total = data.results;
};
export const getSearchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * 10;
  const end = page * 10;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= +newServings / +state.recipe.servings;
  });
  state.recipe.servings = +newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmark to array in state
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};
export const uploadRecipe = async function (newRecipe) {
  console.log(newRecipe);
  const ingredients = Object.entries(newRecipe)

    .filter(ent => ent[0].startsWith('ingredient') && ent[1])

    .map(ing => {
      const ingArr = ing[1].split(',');
      if (ingArr.length !== 3) throw new Error('Invalid data format');
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

  console.log(ingredients);

  const recipe = {
    id: newRecipe.id,
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.time,
    servings: +newRecipe.servings,
    ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
  console.log(data);
  state.recipe = createRecipeObject(data.data.recipe);
  state.recipe.custom = true;
  addBookmark(state.recipe);
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
