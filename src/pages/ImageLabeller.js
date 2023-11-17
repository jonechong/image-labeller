import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import components
import AlertDialog from "../components/AlertDialog";
import SnackbarInfoAlert from "../components/SnackbarInfoAlert";
import ImageView from "../components/ImageView";
import ActionButtons from "../components/ActionButtons";
import DirectoryBrowser from "../components/DirectoryBrowser";
import LabelManager from "../components/LabelManager";

//Import UI
import { getLoadImageButton } from "../ui/ImageLabeller/getLoadImageButton";
import { getImageButtons } from "../ui/ImageLabeller/getImageButtons";
import { getLabellerDialogs } from "../ui/ImageLabeller/getLabellerDialogs";

// Import icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ImageLabeller() {
    const navigate = useNavigate();
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [noMoreImages, setNoMoreImages] = useState(false);
    const [imagesDeleted, setImagesDeleted] = useState(false);
    const [invalidDirectory, setInvalidDirectory] = useState(false);
    const [noImages, setNoImages] = useState(false);
    const [labels, setLabels] = useState(new Set());
    const [selectedLabels, setSelectedLabels] = useState({});

    const handleKeyPress = (event) => {
        // Only allow keypress actions if there are images
        if (images.length > 0) {
            switch (event.key) {
                case "ArrowLeft":
                    showPrevImage();
                    break;
                case "ArrowRight":
                    showNextImage();
                    break;
                case "Delete":
                    handleDeleteImage();
                    break;
                default:
                    break;
            }
        }
    };

    const openDirectoryDialog = async () => {
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
        }
    };

    const handleLabelChange = (label, isChecked) => {
        const updatedSelections = { ...selectedLabels };
        if (isChecked) {
            if (!updatedSelections[currentImage]) {
                updatedSelections[currentImage] = new Set();
            }
            updatedSelections[currentImage].add(label);
        } else {
            updatedSelections[currentImage]?.delete(label);
        }
        setSelectedLabels(updatedSelections);
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
            setInvalidDirectory(true);
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

    const labellerDialogs = getLabellerDialogs(
        imagesDeleted,
        invalidDirectory,
        noImages,
        setImagesDeleted,
        setInvalidDirectory,
        setNoImages
    );
    const loadImageButton = getLoadImageButton(handleImageLoad, navigate);
    const imageButtons = getImageButtons(
        showPrevImage,
        showNextImage,
        handleDeleteImage
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [currentIndex, images]);

    return (
        <Box sx={{ padding: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <IconButton
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">Label Images</Typography>
            </Box>

            {/* Show images options if there are images */}
            {currentImage && (
                <>
                    {/* Display image index */}
                    <Box textAlign="center" my={2}>
                        <Typography variant="h6">
                            Image {currentIndex + 1} of {images.length}
                        </Typography>
                        <Typography>
                            Filename: {extractFilename(currentImage)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                        }}
                    >
                        {/* Display Image */}
                        <ImageView currentImage={currentImage} />
                        {/* Checkbox for labels */}
                        <LabelManager
                            style={{ marginTop: 10 }}
                            labels={labels}
                            setLabels={setLabels}
                            selectedLabels={
                                selectedLabels[currentImage] || new Set()
                            }
                            setSelectedLabels={setSelectedLabels}
                            onLabelChange={handleLabelChange}
                        />
                    </Box>

                    {/* The following shows image action buttons if there is a current image */}
                </>
            )}
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
            {currentImage && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <ActionButtons buttonsProps={imageButtons} />
                </Box>
            )}

            {/* This snackbar shows if there is no more images when user click previous/next */}
            <SnackbarInfoAlert
                alertOpen={noMoreImages}
                onClose={handleNoMoreImages}
                duration={3000}
                alertMessage={"No more images."}
            />
            {labellerDialogs.map((dialog, index) => (
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
