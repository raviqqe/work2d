import { IVideo } from "common/domain/video";

import * as functions from "./functions";
import StatefulItemsRepository from "./stateful-items-repository";

const repository = new StatefulItemsRepository<IVideo>("videos");

export const videosRepository = repository.state;

export async function urlToVideo(url: string): Promise<IVideo> {
    return await functions.call("video", { params: { url } });
}

export async function getTrendingVideos(): Promise<IVideo[]> {
    return await functions.call("trendingVideos");
}