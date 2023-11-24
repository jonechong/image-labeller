export const getImageButtons = (
    showPrevImage,
    showNextImage,
    handleDeleteImage,
    handleMoveImage,
    handleLabelImage
) => [
    {
        label: "Previous Image",
        action: showPrevImage,
        variant: "contained",
        color: "secondary",
        tooltip: "Press ← arrow key for previous image",
    },
    {
        label: "Next Image",
        action: showNextImage,
        variant: "contained",
        color: "secondary",
        tooltip: "Press → arrow key for next image",
    },
    {
        label: "Delete Image",
        action: handleDeleteImage,
        variant: "contained",
        color: "secondary",
        tooltip: "Press Del key to remove image",
    },
    {
        label: "Move Image",
        action: handleMoveImage,
        variant: "contained",
        color: "secondary",
        tooltip: "Press M key to move image",
    },
    {
        label: "Label Image",
        action: handleLabelImage,
        variant: "contained",
        color: "secondary",
        tooltip: "Press L key to label image",
    },
];
