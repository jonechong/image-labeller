import { Box } from "@mui/system";
import DirectoryBrowser from "../DirectoryBrowser";
import ActionButtons from "../ActionButtons";
import { getLoadImageButton } from "../../ui/ImageLabeller/getLoadImageButton";

export default function DirectoryLoader({
    handleImageLoad,
    folderPath,
    handleDirectoryChange,
    openDirectoryDialog,
}) {
    const loadImageButton = getLoadImageButton(handleImageLoad);

    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "50%" }}>
                <DirectoryBrowser
                    folderPath={folderPath}
                    handleDirectoryChange={handleDirectoryChange}
                    openDirectoryDialog={openDirectoryDialog}
                    sx={{ flexGrow: 1 }}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    padding: 2,
                    flexShrink: 0,
                    alignContent: "center",
                }}
            >
                <ActionButtons buttonsProps={loadImageButton} />
            </Box>
        </Box>
    );
}
