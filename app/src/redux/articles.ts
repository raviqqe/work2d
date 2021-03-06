import { articlesRepository, getTrendingArticles, urlToArticle } from "../infra/articles";
import createItemsDuck from "./items";

const duck = createItemsDuck(
    "articles",
    articlesRepository,
    urlToArticle,
    { getTrendingItems: getTrendingArticles });

export const actionCreators = duck.actionCreators;

export const initialState = duck.initialState;

export const reducer = duck.reducer;

export const sagas = duck.sagas;

export const persistent = true;

export const storeInitializer = duck.storeInitializer;
