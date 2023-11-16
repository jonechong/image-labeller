const handleKeyDown = (e) => {
    // Prevent 'e', '+', and '-' from being entered
    if (["e", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
    }
};

export const ImageDownloaderFields = [
    {
        label: (
            <>
                New folder name (name of your food)
                <span style={{ color: "red" }}>*</span>
            </>
        ),
        name: "newFolderName",
        type: "text",
        tooltip:
            "This folder will be created in the selected directory, containing the downloaded images.",
    },
    {
        label: (
            <>
                API Key
                <span style={{ color: "red" }}>*</span>
            </>
        ),
        name: "apiKey",
        type: "text",
        tooltip: "Your custom search API key.",
    },
    {
        label: (
            <>
                Query
                <span style={{ color: "red" }}>*</span>
            </>
        ),
        name: "query",
        type: "text",
        tooltip: "The search query for the images.",
    },
    {
        label: (
            <>
                Start Index (leave 0 if unknown)
                <span style={{ color: "red" }}>*</span>
            </>
        ),
        name: "start",
        type: "number",
        tooltip:
            "The starting index of the search results. If you already had 50 images from this query, you would input 50 here.",
        onKeyDown: handleKeyDown,
    },
    {
        label: (
            <>
                Total number of images
                <span style={{ color: "red" }}>*</span>
            </>
        ),
        name: "totalNum",
        type: "number",
        tooltip:
            "Total number of images to download. Note that the maximum is 200 for each search query.",
        onKeyDown: handleKeyDown,
    },
    {
        label: 'Geolocation for search engine (default "SG")',
        name: "gl",
        type: "text",
        tooltip: "Location of the host server for the search engine.",
    },
    {
        label: 'Host language for search engine (default "EN")',
        name: "hl",
        type: "text",
        tooltip: "Language of the host server for the search engine.",
    },
    {
        label: "Search Engine (leave blank if unknown)",
        name: "cx",
        type: "text",
        tooltip: "The custom search engine ID.",
    },
    {
        label: "User Agent (leave blank if unknown)",
        name: "userAgent",
        type: "text",
        tooltip: "The user agent to use for the search engine.",
    },
];
