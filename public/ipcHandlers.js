const { dialog } = require("electron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
    cx,
    query,
    start,
    totalNum,
    gl,
    hl,
    userAgent = ""
) => {
    if (userAgent == "") {
        userAgent =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";
    }
    const searchResults = [];

    while (searchResults.length < totalNum) {
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
                        start: start,
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
            // Handle retries, sleep, etc.
        }
    }

    const returnResult = searchResults
        .slice(0, totalNumImages)
        .map((item) => item.link);
    console.log(returnResult);
    return returnResult;
};

module.exports = {
    openDirectoryDialog,
    readImageFiles,
    deleteImageFile,
    fetchImageUrls,
};
