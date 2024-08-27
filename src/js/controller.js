import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecepieView from './views/addRecepieView.js';
import bookmarksView from './views/bookmarksView.js';
// import icons from '../img/icons.svg';

import 'core-js/stable';
import 'regenerator-runtime/runtime';


if (module.hot) {
  module.hot.accept();
}


const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1) Render Spinner
    recipeView.renderSpinner();
    // 2) Loading Recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    model.state.search
    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);

  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
}


const controlSearchResults = async function () {
  try {
    // Load spinner
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    const results = model.getSearchResultsPage();

    resultsView.render(results);

    // 4) Render paginations buttons
    paginationView.render(model.state.search)

  } catch (error) {
    console.log(error);
  }
}


const controlPagination = function (goToPage) {

  // 3) Render NEW results
  const results = model.getSearchResultsPage(goToPage);

  resultsView.render(results);

  // 4) Render NEW paginations buttons
  paginationView.render(model.state.search)
}


const controlServings = function (servings) {
  // Update the recepie servings (in state)
  model.updateServings(servings);

  // Update the recepie view
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBoomark(model.state.recipe)
  } else {
    if (model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);
  }
  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks

  bookmarksView.render(model.state.bookmarks)

}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {

    addRecepieView.renderSpinner();
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe);

    // Render Recipe

    recipeView.render(model.state.recipe);

    // Success message
    addRecepieView.renderMessage();

    // Render Bookmark viw

    bookmarksView.render(model.state.bookmarks);

    // Change ID URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecepieView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch (error) {
    console.log(error.message);
    addRecepieView.renderError(error.message);
  }

  // Model upload
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServigs(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecepieView._addHandlerUpload(controlAddRecipe);
};


init();

// window.addEventListener('hashchange', controlRecipes)
// window.addEventListener('load', controlRecipes)

// controlRecipes();

