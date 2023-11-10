import React from "react";
import { Button, Typography, Box } from "@mui/material";

export default function DirectoryOpener({ onDirectorySelect }) {
    const handleOpenDialog = async () => {
        const selectedDirectory = await window.api.openDirectoryDialog();
        if (selectedDirectory) {
            onDirectorySelect(selectedDirectory);
        }
    };

    return (
        <Button variant="outlined" onClick={handleOpenDialog}>
            Select Directory
        </Button>
    );
}
