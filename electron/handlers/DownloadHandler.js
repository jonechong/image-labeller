const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class DownloadHandler {
    async fetchImageUrls(
        event,
        apiKey,
        query,
        start,
        totalNum,
        gl,
        hl,
        cx,
        userAgent
    ) {
        gl = gl || "SG";
        hl = hl || "EN";
        cx = cx || "b28673ebe9aa84a44";
        userAgent =
            userAgent ||
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";
        const searchResults = [];
        let retries = 3; // Maximum number of retries
        let fetchedCount = 0; // Number of fetched URLs
        const requiredFetchCount = Math.ceil(totalNum / 10);

        while (fetchedCount < requiredFetchCount && retries >= 0) {
            try {
                const response = await axios.get(
                    "https://www.googleapis.com/customsearch/v1",
                    {
                        params: {
                            key: apiKey,
                            cx: cx,
                            q: query,
                            searchType: "image",
                            num: 10,
                            start: start + 1,
                            gl: gl,
                            hl: hl,
                        },
                        headers: {
                            "User-Agent": userAgent,
                        },
                    }
                );
                const items = response.data.items || [];
                searchResults.push(...items);
                start += items.length;
                fetchedCount++;
                event.sender.send("fetch-progress", {
                    progress: fetchedCount / requiredFetchCount,
                    fetchIndex: fetchedCount,
                });
                if (!response.data.queries.nextPage) break;
            } catch (error) {
                if (retries <= 0) {
                    event.sender.send("fetch-progress", {
                        progress: 1,
                        fetchIndex: requiredFetchCount,
                        message: `Max retries reached.`,
                    });
                    console.error("Max retries reached.");
                    break;
                }
                event.sender.send("fetch-progress", {
                    progress: fetchedCount / requiredFetchCount,
                    fetchIndex: fetchedCount,
                    message: `An error occurred: ${error.message}. Retrying...`,
                });
                console.error(
                    `An error occurred: ${error.message}. Retrying...`
                );
                retries--;
            }
        }

        const returnResult = searchResults
            .slice(0, totalNum)
            .map((item) => item.link);
        return returnResult;
    }

    async downloadImages(event, imageUrls, folderPath, startNum, userAgent) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        userAgent =
            userAgent ||
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";

        startNum = parseInt(startNum, 10) || 0;

        for (let i = 0; i < imageUrls.length; i++) {
            const imgUrl = imageUrls[i];
            try {
                const response = await axios.get(imgUrl, {
                    responseType: "arraybuffer",
                    headers: { "User-Agent": userAgent },
                });

                const image = sharp(response.data);
                const imageFormat =
                    response.headers["content-type"].split("/")[1];
                const filename = `image_${i + startNum + 1}.${imageFormat}`;

                await image.toFile(path.join(folderPath, filename));
                console.log(`Downloaded image ${i + startNum + 1}`);

                event.sender.send("download-progress", {
                    progress: (i + 1) / imageUrls.length,
                    imageIndex: i,
                    message: `Downloaded image ${i + startNum + 1}`,
                });
            } catch (error) {
                event.sender.send("download-progress", {
                    progress: (i + 1) / imageUrls.length,
                    imageIndex: i,
                    message: `Error downloading image ${i + startNum + 1}: ${
                        error.message
                    }`,
                });
            }
        }
        event.sender.send("download-progress", {
            progress: 1,
            imageIndex: imageUrls.length,
            message: `Download completed!`,
        });
    }
}

module.exports = DownloadHandler;
