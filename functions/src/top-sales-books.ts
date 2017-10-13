import axios from "axios";
import { Response } from "express";

import { callApi } from "./rakuten";
import { httpsFunction } from "./utils";

const filteredWords: string[] = ["LINE", "Twitter", "年賀状", "撮影"];

export async function getTopSalesBooks(): Promise<any[]> {
    return (await callApi("Book", { booksGenreId: "001005", sort: "sales" }))
        .filter(({ name }) => !filteredWords.some((pattern) => name.includes(pattern)));
}

export default httpsFunction(async (_, response: Response) => {
    response.send(await getTopSalesBooks());
});
