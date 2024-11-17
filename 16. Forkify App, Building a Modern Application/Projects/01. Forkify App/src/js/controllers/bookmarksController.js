import ResultsController from "./resultsController";
import BookmarksModel from "../models/bookmarksModel";
import BookmarksView from "../views/bookmarksView";

export default class BookmarksController extends ResultsController {
  #model;
  #view;

  constructor(appState) {
    super(appState);

    this.#model = new BookmarksModel(appState);
    this.#view = new BookmarksView();

    this.eventBus.subscribe(`OpenBookmarks`, this.#controlBookmarksResults.bind(this));
    this.eventBus.subscribe(`bookmark`, this.#controlOnBookmark.bind(this));
  }

  #controlBookmarksResults() {
    this.#view.updateTitle();
    this.#model.searchBookmarks() && this.updateResults();
  }

  #controlOnBookmark(recipe) {
    this.#model.isPresentBookmark(recipe.id) ? this.#model.deleteBookmark(recipe.id) : this.#model.createBookmark(recipe);
    this.getState(`search.query`) === `page-bookmarks` && this.updateResults(this.getState(`bookmarks`));
  }

  init = () => this.#model.getStoredBookmarks();
}
