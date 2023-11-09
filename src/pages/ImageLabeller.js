import React, { useState } from "react";
import { TextField, Button, Box, Card, CardMedia } from "@mui/material";

export default function ImageLabeller() {
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null); // Placeholder for the current image path
    const [images, setImages] = useState([]); // State to store image paths

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

    const handleImageLoad = async () => {
        if (!folderPath) return;
        try {
            const imageFiles = await window.api.readImageFiles(folderPath);
            console.log(imageFiles);
            setImages(imageFiles); // Update state with image paths
            setCurrentImage(imageFiles[0]); // Set the first image as current
        } catch (error) {
            console.error("Error reading images: ", error);
        }
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
            {images.map((image) => (
                <Card key={image}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt="Loaded Image"
                        sx={{
                            maxHeight: 500,
                            maxWidth: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Card>
            ))}
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
