import React, { useState } from "react";
import { TextField, Button, Box, Card, CardMedia } from "@mui/material";

export default function ImageLabeller() {
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null); // Placeholder for the current image path

    const handleOpenDialog = async () => {
        // Use the exposed function from the preload script
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
            // Load images from the selected directory
            handleImageLoad(folderPath);
        }
    };

    const handleDirectoryChange = (event) => {
        setFolderPath(event.target.value);
    };

    const handleDeleteImage = () => {
        // Placeholder function to delete the current image
        console.log("Delete image at", currentImage);
        // Logic to delete the image and fetch the next one goes here
    };

    const handleImageLoad = () => {
        // Placeholder function to load the first image from the directory
        console.log("Load images from", folderPath);
        // Logic to load images goes here
    };

    return (
        <Box sx={{ padding: 2 }}>
            <TextField
                fullWidth
                label="Folder Directory"
                value={folderPath}
                onChange={handleDirectoryChange}
                margin="normal"
                variant="outlined"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleImageLoad}
                sx={{ margin: 1 }}
            >
                Load Images
            </Button>
            <Button variant="contained" onClick={handleOpenDialog}>
                Browse Folders
            </Button>
            {currentImage && (
                <Card>
                    <CardMedia
                        component="img"
                        image={currentImage}
                        alt="Current Image"
                        sx={{
                            maxHeight: 500,
                            maxWidth: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Card>
            )}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteImage}
                sx={{ margin: 1 }}
            >
                Delete Image
            </Button>
        </Box>
    );
}
