import { API_URL } from "./config";
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";
import { RES_PER_PAGE } from "./config";
import { KEY } from "./config";
import recipeView from "./views/recipeView";
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: []
}

export const loadRecipe = async function (id) {
    try {

        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)

        const { recipe } = data.data;

        // Restructure object before return
        state.recipe = createRecipeObject(recipe);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else {
            state.recipe.bookmarked = false;
        }
        // console.log(state.recipe);
    } catch (error) {
        // console.error(`${error} 🫥🫥🫥`);
        throw error;
    }

}


export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage //  0;
    const end = page * state.search.resultsPerPage // 9;

    return state.search.results.slice(start, end);
}

export const loadSearchResults = async function (query) {
    try {
        state.search.page = 1;
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
            };
        });
    } catch (error) {
        throw error;
    }
};


export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings
    });
    state.recipe.servings = newServings;
}

const presistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}



export const addBoomark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    presistBookmarks();
}


export const deleteBookmark = function (id) {
    //  Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmark

    if (id === state.recipe.id) state.recipe.bookmarked = false;

    presistBookmarks();
}


const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};

init();


const clearBookmakrs = function () {
    localStorage.clear('bookmarks');
};

// clearBookmakrs();

const createRecipeObject = function (data) {
    return {
        id: data.id,
        title: data.title,
        publisher: data.publisher,
        sourceUrl: data.source_url,
        image: data.image_url,
        servings: data.servings,
        cookingTime: data.cooking_time,
        ingredients: data.ingredients,
        ...(data.key && { key: data.key })
    };
}

export const uploadRecipe = async function (newRecipe) {
    try {
        // Transform data
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3) {
                    throw new Error('Wrong ingredient format, please use the correct format')
                };
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description };
            });


        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data.data.recipe);
        addBoomark(state.recipe);
    } catch (error) {
        throw error
    }



}