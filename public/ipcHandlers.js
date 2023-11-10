const { dialog } = require("electron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const readImageFiles = async (event, folderPath) => {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files
        .filter((file) => {
            return [".jpg", ".jpeg", ".png", ".bmp", ".webp"].includes(
                path.extname(file).toLowerCase()
            );
        })
        .map((file) => {
            // Convert to file:// URL
            const filePath = path.join(folderPath, file);
            return `file://${filePath.replace(/\\/g, "/")}`;
        });
    return imageFiles;
};

const openDirectoryDialog = async (event) => {
    // Opens a dialog to select directories only
    const { filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
    });
    return filePaths[0]; // returns the selected directory path
};

const deleteImageFile = async (event, filePath) => {
    try {
        // Decode the URI and remove 'file://' if present
        const decodedPath = decodeURI(filePath.replace("file://", ""));

        // Use trash to move the file to the bin
        const trash = await import("trash");
        await trash.default(decodedPath);
        return { success: true };
    } catch (error) {
        console.error(`Error moving file to trash: ${error}`);
        return { success: false, error: error.message };
    }
};

const fetchImageUrls = async (
    event,
    apiKey,
    query,
    start,
    totalNum,
    gl,
    hl,
    cx,
    userAgent
) => {
    gl = gl || "SG";
    hl = hl || "EN";
    cx = cx || "b28673ebe9aa84a44";
    userAgent =
        userAgent ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";
    const searchResults = [];
    let currentStart = start;
    let retries = 3; // Maximum number of retries

    while (searchResults.length < totalNum && retries > 0) {
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

            if (!response.data.queries.nextPage) break;
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            retries--;
            if (retries <= 0) {
                console.error("Max retries reached.");
                break;
            }
        }
    }

    const returnResult = searchResults
        .slice(0, totalNum)
        .map((item) => item.link);
    return returnResult;
};

const downloadImages = async (
    event,
    imageUrls,
    folderPath,
    startNum,
    userAgent
) => {
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
            const imageFormat = response.headers["content-type"].split("/")[1];
            const filename = `image_${i + startNum + 1}.${imageFormat}`;

            await image.toFile(path.join(folderPath, filename));
            console.log(`Downloaded image ${i + startNum + 1}`);

            event.sender.send("download-progress", { progress: (i + 1) / imageUrls.length });
        } catch (error) {
            console.error(
                `Error downloading image ${i + startNum + 1}:`,
                error.message
            );
        }
    }
};

module.exports = {
    openDirectoryDialog,
    readImageFiles,
    deleteImageFile,
    fetchImageUrls,
    downloadImages,
};
