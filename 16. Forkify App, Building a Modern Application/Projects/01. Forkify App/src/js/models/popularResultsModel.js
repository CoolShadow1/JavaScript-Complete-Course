import ResultsModel from "./resultsModel";
import { API_URL } from "../config/config";

export default class PopularResultsModel extends ResultsModel {
  constructor(appState) {
    super(appState);
  }

  async getPopularRecipes() {
    const recipesId = this.appState.getState(`popularRecipes`);
    const recipePrefix = `664c8f193e7aa067e94e8`;

    const results = await Promise.allSettled(
      recipesId.map(async id => {
        try {
          const response = await fetch(`${API_URL}/${recipePrefix}${id}`);
          if (!response.ok) throw new Error(`Error fetching recipe`);

          const data = await response.json();
          if (!data) throw new Error(`Error reading recipe data`);

          const recipe = data.data.recipe;
          return {
            title: recipe.title,
            id: recipe.id,
            image_url: recipe.image_url,
            publisher: recipe.publisher,
          };
        } catch (err) {
          console.error(`Failed to fetch recipe with ID ${id}: ${err.message}`);
          return null;
        }
      })
    );

    const recipes = results.filter(result => result.status === "fulfilled" && result.value !== null).map(result => result.value);
    const totalPages = Number.parseInt(recipes.length / this.appState.getState(`search.resultsPerPage`)) + 1;

    this.appState.updateState(`search.response`, recipes);
    this.appState.updateState(`search.currentPage`, 1);
    this.appState.updateState(`search.totalPages`, totalPages);

    return recipes;
  }
}
