import { IVideo } from "common/domain/video";
import is = require("is_js");

import { convertUrlIntoItem, trendingVideos } from "../video";

jest.setTimeout(20000);

test("Convert URLs into video objects", async () => {
    expect.assertions(2 * 7);

    for (const videoUrl of [
        "https://www.youtube.com/watch?v=2V1FtfBDsLU&t=2s",
        "https://www.youtube.com/watch?v=vS5hct55p40",
    ]) {
        const { description, embedUrl, id, name, publishedAt, url }
            = await convertUrlIntoItem(videoUrl);

        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
        expect(typeof name).toBe("string");
        expect(typeof description).toBe("string");
        expect(is.url(embedUrl)).toBe(true);
        expect(typeof publishedAt).toBe("string");
        expect(is.url(url)).toBe(true);
    }
});

test("Fetch trending videos", async () => {
    expect.assertions(1);

    await trendingVideos(
        { get: () => "headerContent" } as any,
        {
            send: (videos) => expect(videos.length).toBeGreaterThan(1),
            set: () => undefined,
        } as any);
});
