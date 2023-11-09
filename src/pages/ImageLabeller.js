import React, { useState } from "react";
import { TextField, Button, Box, Card, CardMedia } from "@mui/material";
import AlertDialog from "../components/AlertDialog";
import SnackbarInfoAlert from "../components/SnackbarInfoAlert";
import ImageView from "../components/ImageView";

export default function ImageLabeller() {
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [noMoreImages, setNoMoreImages] = useState(false);
    const [imagesDeleted, setImagesDeleted] = useState(false);
    const [invalidDirectory, setInvalidDirectory] = useState(false);

    const handleOpenDialog = async () => {
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
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
                    setImagesDeleted(true);
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
        if (!folderPath) {
            setInvalidDirectory(true);
            return;
        }
        try {
            const imageFiles = await window.api.readImageFiles(folderPath);
            setImages(imageFiles);
            setCurrentImage(imageFiles[0]);
            setCurrentIndex(0);
        } catch (error) {
            console.error("Error reading images: ", error);
        }
    };

    const handleNoMoreImages = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setNoMoreImages(false);
    };

    const showNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentImage(images[currentIndex + 1]);
        } else {
            setNoMoreImages(true);
        }
    };

    const showPrevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentImage(images[currentIndex - 1]);
        } else {
            setNoMoreImages(true);
        }
    };

    const buttonsConfig = [
        {
            label: "Delete Image",
            action: handleDeleteImage,
            variant: "contained",
            color: "secondary",
        },
        {
            label: "Previous Image",
            action: showPrevImage,
            variant: "contained",
        },
        { label: "Next Image", action: showNextImage, variant: "contained" },
    ];

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
            <ImageView currentImage={currentImage} />
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
            {/* This snackbar shows if there is no more images when user click previous/next */}
            <SnackbarInfoAlert
                alertOpen={noMoreImages}
                onClose={handleNoMoreImages}
                duration={3000}
                alertMessage={"No more images."}
            />
            {/* This alert dialog shows when all images have been deleted */}
            <AlertDialog
                dialogOpen={imagesDeleted}
                setDialogOpen={setImagesDeleted}
                dialogMessage={"All images have been deleted!"}
                dialogTitle={"Alert"}
            />
            {/* This alert dialog shows when user clicks load image without selecting a directory */}
            <AlertDialog
                dialogOpen={invalidDirectory}
                setDialogOpen={setInvalidDirectory}
                dialogMessage={"Please select a valid directory first."}
                dialogTitle={"Invalid Directory"}
            />
        </Box>
    );
}
