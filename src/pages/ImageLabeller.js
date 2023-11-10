import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import AlertDialog from "../components/AlertDialog";
import SnackbarInfoAlert from "../components/SnackbarInfoAlert";
import ImageView from "../components/ImageView";
import ActionButtons from "../components/ActionButtons";

export default function ImageLabeller() {
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [noMoreImages, setNoMoreImages] = useState(false);
    const [imagesDeleted, setImagesDeleted] = useState(false);
    const [invalidDirectory, setInvalidDirectory] = useState(false);
    const [noImages, setNoImages] = useState(false);

    const openDirectoryDialog = async () => {
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
            }
        } catch (error) {
            console.error("Error sending delete image IPC message:", error);
        }
    };

    const extractFilename = (path) => {
        return path.split("/").pop().split("\\").pop(); // Handles both UNIX and Windows paths
    };

    const handleImageLoad = async () => {
        if (!folderPath) {
            setInvalidDirectory(true);
            return;
        }
        try {
            const imageFiles = await window.api.readImageFiles(folderPath);
            if (imageFiles.length === 0) {
                setNoImages(true);
                return;
            }
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

    const imageActionButtons = [
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

    const directoryButtons = [
        {
            label: "Select Directory",
            action: openDirectoryDialog,
            variant: "contained",
        },
        { label: "Load Images", action: handleImageLoad, variant: "contained" },
    ];

    const alertDialogConfigs = [
        {
            open: imagesDeleted,
            setOpen: setImagesDeleted,
            message: "All images have been deleted!",
            title: "Alert",
        },
        {
            open: invalidDirectory,
            setOpen: setInvalidDirectory,
            message: "Please select a valid directory first.",
            title: "Invalid Directory",
        },
        {
            open: noImages,
            setOpen: setNoImages,
            message: "There are no images in this directory.",
            title: "No Images Found",
        },
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
            />
            {/* The following shows directory action buttons */}
            <ActionButtons buttonsProps={directoryButtons} />
            {/* Display Image Index */}
            {images.length > 0 && (
                <Box textAlign="center" my={2}>
                    <Typography variant="h6">
                        Image {currentIndex + 1} of {images.length}
                    </Typography>
                    <Typography>
                        Filename: {extractFilename(currentImage)}
                    </Typography>
                </Box>
            )}
            {/* The following shows the image if there is a current image */}
            <ImageView currentImage={currentImage} />
            {/* The following shows image action buttons if there is a current image */}
            {currentImage && (
                <ActionButtons buttonsProps={imageActionButtons} />
            )}
            {/* This snackbar shows if there is no more images when user click previous/next */}
            <SnackbarInfoAlert
                alertOpen={noMoreImages}
                onClose={handleNoMoreImages}
                duration={3000}
                alertMessage={"No more images."}
            />
            {alertDialogConfigs.map((dialog, index) => (
                <AlertDialog
                    key={index}
                    dialogOpen={dialog.open}
                    setDialogOpen={dialog.setOpen}
                    dialogMessage={dialog.message}
                    dialogTitle={dialog.title}
                />
            ))}
        </Box>
    );
}
