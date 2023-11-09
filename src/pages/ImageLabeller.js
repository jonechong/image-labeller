import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Card,
    CardMedia,
    Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export default function ImageLabeller() {
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [alertOpen, setAlertOpen] = useState(false); // State for Snackbar alert

    const handleOpenDialog = async () => {
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
            handleImageLoad(folderPath);
        }
    };

    const handleDirectoryChange = (event) => {
        setFolderPath(event.target.value);
    };

    const handleDeleteImage = async () => {
        if (!currentImage) return;
        try {
            const response = await window.api.deleteImageFile(currentImage);
            if (response.success) {
                const newImages = images.filter((img) => img !== currentImage);
                setImages(newImages);
                if (newImages.length === 0) {
                    setCurrentImage(null);
                } else if (currentIndex >= newImages.length) {
                    setCurrentIndex(newImages.length - 1);
                    setCurrentImage(newImages[newImages.length - 1]);
                } else {
                    setCurrentImage(newImages[currentIndex]);
                }
            } else {
                console.error("Error deleting the image:", response.error);
                // Handle error (e.g., show an alert to the user)
            }
        } catch (error) {
            console.error("Error sending delete image IPC message:", error);
            // Handle error (e.g., show an alert to the user)
        }
    };

    const handleImageLoad = async () => {
        if (!folderPath) return;
        try {
            const imageFiles = await window.api.readImageFiles(folderPath);
            setImages(imageFiles);
            setCurrentImage(imageFiles[0]);
            setCurrentIndex(0);
        } catch (error) {
            console.error("Error reading images: ", error);
        }
    };

    const handleAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlertOpen(false);
    };

    const showNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentImage(images[currentIndex + 1]);
        } else {
            setAlertOpen(true);
        }
    };

    const showPrevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentImage(images[currentIndex - 1]);
        } else {
            setAlertOpen(true);
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
            />{" "}
            <Button variant="contained" onClick={handleOpenDialog}>
                Select Directory
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleImageLoad}
                sx={{ margin: 1 }}
            >
                Load Images
            </Button>
            {currentImage && (
                <Card>
                    <CardMedia
                        component="img"
                        image={currentImage}
                        alt="Loaded Image"
                        sx={{
                            maxHeight: 500,
                            maxWidth: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Card>
            )}
            {currentImage && (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDeleteImage}
                        sx={{ margin: 1 }}
                    >
                        Delete Image
                    </Button>
                    <Button
                        variant="contained"
                        onClick={showPrevImage}
                        sx={{ margin: 1 }}
                    >
                        Previous Image
                    </Button>
                    <Button
                        variant="contained"
                        onClick={showNextImage}
                        sx={{ margin: 1 }}
                    >
                        Next Image
                    </Button>
                </>
            )}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={handleAlertClose}
            >
                <MuiAlert
                    onClose={handleAlertClose}
                    severity="info"
                    sx={{ width: "100%" }}
                >
                    No more images.
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}
