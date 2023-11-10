import React from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

export default function DirectoryBrowser({
    folderPath,
    handleDirectoryChange,
    openDirectoryDialog,
}) {
    return (
        <TextField
            fullWidth
            label={
                <>
                    Folder Directory
                    <span style={{ color: "red" }}>*</span>
                </>
            }
            value={folderPath}
            onChange={handleDirectoryChange}
            margin="normal"
            variant="outlined"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="open directory"
                            onClick={openDirectoryDialog}
                        >
                            <FolderOpenIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
