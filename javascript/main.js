let apiKey = "90b4bf234e22493e89325b6f9cce868e";

let randomRecipesUrl = "https://api.spoonacular.com/recipes/random?apiKey=" + apiKey + "&number=2";

let recipesByIngredientsUrl = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + apiKey + "&number=2";

let recipeFullInfoEndpointUrl = "https://api.spoonacular.com/recipes/";

let favouriteRecipes = localStorage.getItem('favouriteRecipes');
if (favouriteRecipes === null) {
    favouriteRecipes = [];
} else {
    favouriteRecipes = JSON.parse(favouriteRecipes);
}

function saveFavouriteRecipes() {
    localStorage.setItem('favouriteRecipes', JSON.stringify(favouriteRecipes));

}

async function onSearchClicked() {
    let userInput = document.getElementById("searchField").value;
    let results = await searchRecipesByIngredients(userInput);
    showResults(results);
}

async function getRandomRecepies() {
    let response = await fetch(randomRecipesUrl);
    let recipeList = await response.json();
    return recipeList.recipes;
}

async function showRandomRecipes() {
    let results = await getRandomRecepies();
    showResults(results);
}

async function searchRecipesByIngredients(items) {
    let url = recipesByIngredientsUrl + "&ingredients=" + encodeURIComponent(items);
    // console.log(url);
    let response = await fetch(url);
    let recipeList = await response.json();
    // console.log(recipeList);
    return recipeList;
}

function showResults(recipeList) {
    clearResults();
    clearRecipe();

    let allElements = [];

    for (let i = 0; i < recipeList.length; i++) {
        let recipeEl = document.createElement('div');
        allElements.push(recipeEl);
        recipeEl.className = 'recipeEl';
        recipeEl.onclick = function () {
            showRecipe(recipeList[i].id);

            for (let el of allElements) {
                el.classList.remove('selected');
            }

            recipeEl.classList.add('selected');
        }
        document.getElementById("recipeList").appendChild(recipeEl);

        let thumbnailImg = document.createElement('img');
        thumbnailImg.className = 'thumb';
        thumbnailImg.src = recipeList[i].image;
        recipeEl.appendChild(thumbnailImg);

        let recipeInfoEl = document.createElement('div');
        recipeInfoEl.className = 'recipeInfo';
        recipeEl.appendChild(recipeInfoEl);

        let recipeName = document.createElement('h2');
        recipeName.className = 'recipeName';
        recipeName.textContent = recipeList[i].title;
        recipeInfoEl.appendChild(recipeName);
    }
}

function clearResults() {
    let clearResults = document.getElementById("recipeList");
    clearResults.innerHTML = "";
}

async function getRecipeFullInfo(item) {
    let url = recipeFullInfoEndpointUrl + item + "/information?includeNutrition=true&apiKey=" + apiKey;
    // console.log(url);
    let response = await fetch(url);
    let recipeInfo = await response.json();
    // console.log(recipeInfo);
    return recipeInfo;
}

async function showRecipe(id) {
    clearRecipe();

    let recipeFullInfo = await getRecipeFullInfo(id);
    console.log(recipeFullInfo);

    let bigImg = document.createElement('img');
    bigImg.src = recipeFullInfo.image;
    document.getElementById("recipe").appendChild(bigImg);

    let recipeInfoEl = document.createElement('div');
    recipeInfoEl.className = 'recipeInfo';
    document.getElementById("recipe").appendChild(recipeInfoEl);

    let recipeName = document.createElement('h2');
    recipeName.className = 'recipeName';
    recipeName.textContent = recipeFullInfo.title;
    recipeInfoEl.appendChild(recipeName);

    let servingsEl = document.createElement('div');
    servingsEl.className = 'servingsEl';
    recipeInfoEl.appendChild(servingsEl);

    let utensilsIcon = document.createElement('i');
    utensilsIcon.className = 'fas fa-utensils';
    servingsEl.appendChild(utensilsIcon);

    let servings = document.createElement('span');
    servings.className = 'servings';
    if (recipeFullInfo.servings === 1) {
        servings.textContent = recipeFullInfo.servings + ' serving';
    } else {
        servings.textContent = recipeFullInfo.servings + ' servings';
    }
    servingsEl.appendChild(servings);

    let cookingTimeEl = document.createElement('div');
    cookingTimeEl.className = 'cookingTimeEl';
    recipeInfoEl.appendChild(cookingTimeEl);

    let clockIcon = document.createElement('i');
    clockIcon.className = 'far fa-clock';
    cookingTimeEl.appendChild(clockIcon);

    let cookingTime = document.createElement('span');
    cookingTime.className = 'cookingTime';
    cookingTime.textContent = recipeFullInfo.readyInMinutes + ' Min';
    cookingTimeEl.appendChild(cookingTime);

    let heartIcon = document.createElement('i');
    heartIcon.className = 'fas fa-heart';
    

    let ingredientsEl = document.createElement('ul');
    ingredientsEl.className = 'ingredientsEl';
    ingredientsEl.textContent = 'Ingredients: ';
    recipeInfoEl.appendChild(ingredientsEl);

    for (let i=0; i < recipeFullInfo.extendedIngredients.length; i++) {
        let ingredient = document.createElement('li');
        ingredient.textContent = recipeFullInfo.extendedIngredients[i].original;
        // console.log(ingredient);
        ingredientsEl.appendChild(ingredient);
    }
}

function clearRecipe() {
    let clearResults = document.getElementById("recipe");
    clearResults.innerHTML = "";
    // console.log(clearResults);
}

showRandomRecipes();