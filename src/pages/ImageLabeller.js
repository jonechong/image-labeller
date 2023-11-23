import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import components
import AlertDialog from "../components/AlertDialog";
import SnackbarInfoAlert from "../components/SnackbarInfoAlert";
import ImageView from "../components/ImageView";
import ActionButtons from "../components/ActionButtons";
import LabelManager from "../components/ImageLabeller/LabelManager";
import PageHeader from "../components/PageHeader";
import ImageHeader from "../components/ImageHeader";

// Import UI
import { getImageButtons } from "../ui/ImageLabeller/getImageButtons";

// Import directory functions
import {
    getBasePath,
    getFileName,
    extractFilename,
} from "../utils/directoryUtils";
import DirectoryLoader from "../components/ImageLabeller/DirectoryLoader";

// Import colour generation function
import { generateColor } from "../utils/colors";

// Define constants
const LabelHelperText =
    "This feature allows you to label images, you can move images to different folders based on the labels you select. If these folders do not exist, they are created automatically.";

export default function ImageLabeller() {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [folderPath, setFolderPath] = useState("");
    const [currentImage, setCurrentImage] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [noMoreImages, setNoMoreImages] = useState(false);
    const [labels, setLabels] = useState(new Set());
    const [selectedLabels, setSelectedLabels] = useState(new Set());
    const [labelColors, setLabelColors] = useState({});
    const [drawingLabel, setDrawingLabel] = useState("");
    const [boxes, setBoxes] = useState([]);

    const openDirectoryDialog = async () => {
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
        }
    };

    const handleLabelChange = (label, isChecked) => {
        const updatedLabels = new Set(selectedLabels);

        if (isChecked) {
            updatedLabels.add(label);
        } else {
            updatedLabels.delete(label);
        }

        setSelectedLabels(updatedLabels);
    };

    const handleDirectoryChange = (event) => {
        setFolderPath(event.target.value);
    };

    const handleDeleteImage = useCallback(async () => {
        if (!currentImage) return;
        try {
            const response = await window.api.deleteImageFile(currentImage);
            if (response.success) {
                const newImages = images.filter((img) => img !== currentImage);
                setImages(newImages);
                if (newImages.length === 0) {
                    setCurrentImage(null);
                    showAlertMessage(
                        true,
                        "No Images Found",
                        "There are no images in this directory."
                    );
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
    }, [currentImage, currentIndex, images]);

    const handleMoveImage = useCallback(async () => {
        if (selectedLabels.size === 0) {
            showAlertMessage(
                true,
                "No Labels Selected",
                "Please select at least one label."
            );
            return;
        }
        const selectedLabelsArray = Array.from(selectedLabels);
        for (let i = 0; i < selectedLabelsArray.length; i++) {
            const basePath = getBasePath(currentImage);
            const fileName = getFileName(currentImage);
            const newPath =
                basePath + "/" + selectedLabelsArray[i] + "/" + fileName;
            try {
                await window.api.createFolder(basePath, selectedLabelsArray[i]);
                await window.api.copyImageToDirectory(
                    basePath + "/" + fileName,
                    newPath
                );
            } catch (error) {
                console.error("Error moving image: ", error);
            }
        }
        await handleDeleteImage();
    }, [currentImage, handleDeleteImage, selectedLabels]);

    const showAlertMessage = (show, title, message) => {
        setShowAlert(show);
        setAlertTitle(title);
        setAlertMessage(message);
    };

    const handleImageLoad = async () => {
        if (!folderPath) {
            showAlertMessage(
                true,
                "Invalid Directory",
                "Please input a valid directory first."
            );
            return;
        }
        try {
            const imageFiles = await window.api.readImageFiles(folderPath);
            if (imageFiles.length === 0) {
                showAlertMessage(
                    true,
                    "No Images Found",
                    "There are no images in this directory."
                );
                return;
            }
            setImages(imageFiles);
            setCurrentImage(imageFiles[0]);
            setCurrentIndex(0);
        } catch (error) {
            console.error("Error reading images: ", error);
            showAlertMessage(
                true,
                "Invalid Directory",
                "Please input a valid directory first."
            );
        }
    };

    const handleNoMoreImages = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setNoMoreImages(false);
    };

    const showNextImage = useCallback(() => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentImage(images[currentIndex + 1]);
        } else {
            setNoMoreImages(true);
        }
    }, [currentIndex, images]);

    const showPrevImage = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentImage(images[currentIndex - 1]);
        } else {
            setNoMoreImages(true);
        }
    }, [currentIndex, images]);

    const imageButtons = getImageButtons(
        showPrevImage,
        showNextImage,
        handleDeleteImage,
        handleMoveImage
    );

    const handleKeyPress = useCallback(
        (event) => {
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
                    case "m":
                        handleMoveImage();
                        break;
                    default:
                        break;
                }
            }
        },
        [
            images,
            showPrevImage,
            showNextImage,
            handleDeleteImage,
            handleMoveImage,
        ]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    useEffect(() => {
        setBoxes([]);
    }, [currentIndex, images]);

    useEffect(() => {
        const newLabelColors = {};
        Array.from(labels).forEach((label, index) => {
            newLabelColors[label] = generateColor(index);
        });
        setLabelColors(newLabelColors);
    }, [labels]);

    useEffect(() => {
        console.log("Boxes changed:", boxes);
    }, [boxes]);

    useEffect(() => {}, []);

    return (
        <Box sx={{ padding: 2 }}>
            <PageHeader
                title="Label Images"
                navigateFunc={() => {
                    navigate("/");
                }}
                tooltip={LabelHelperText}
            />
            {currentImage && (
                <>
                    <ImageHeader
                        header={`Image ${currentIndex + 1} of ${images.length}`}
                        subheader={`Filename: ${extractFilename(currentImage)}`}
                        tooltipMessage={
                            "Select a label and click on the image to draw a bounding box."
                        }
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                        }}
                    >
                        <ImageView
                            currentImage={currentImage}
                            boxes={boxes}
                            setBoxes={setBoxes}
                            labels={labels}
                            drawingLabel={drawingLabel}
                            labelColors={labelColors}
                        />
                        <LabelManager
                            style={{ marginTop: 10 }}
                            labels={labels}
                            labelColors={labelColors}
                            setLabels={setLabels}
                            selectedLabels={selectedLabels}
                            setSelectedLabels={setSelectedLabels}
                            drawingLabel={drawingLabel}
                            setDrawingLabel={setDrawingLabel}
                            onLabelChange={handleLabelChange}
                        />
                    </Box>
                </>
            )}
            <DirectoryLoader
                handleImageLoad={handleImageLoad}
                folderPath={folderPath}
                handleDirectoryChange={handleDirectoryChange}
                openDirectoryDialog={openDirectoryDialog}
            />
            {currentImage && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <ActionButtons buttonsProps={imageButtons} />
                </Box>
            )}
            <SnackbarInfoAlert
                alertOpen={noMoreImages}
                onClose={handleNoMoreImages}
                duration={3000}
                alertMessage={"No more images."}
            />
            <AlertDialog
                dialogOpen={showAlert}
                setDialogOpen={setShowAlert}
                dialogMessage={alertMessage}
                dialogTitle={alertTitle}
            />
        </Box>
    );
}
