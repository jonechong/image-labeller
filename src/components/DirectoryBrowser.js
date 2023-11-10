import React from "react";
import { Button } from "@mui/material";

export default function DirectoryBrowser({ onDirectorySelect }) {
    const handleOpenDialog = async () => {
        const selectedDirectory = await window.api.openDirectoryDialog();
        if (selectedDirectory) {
            onDirectorySelect(selectedDirectory);
        }
    };

    return (
        <Button variant="contained" onClick={handleOpenDialog}>
            Select Directory
        </Button>
    );
}
