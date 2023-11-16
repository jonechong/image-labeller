export const getImageButtons = (
    showPrevImage,
    showNextImage,
    handleDeleteImage
) => [
    {
        label: "Previous Image",
        action: showPrevImage,
        variant: "contained",
        tooltip: "Press ← arrow key for previous image",
    },
    {
        label: "Next Image",
        action: showNextImage,
        variant: "contained",
        tooltip: "Press → arrow key for next image",
    },
    {
        label: "Delete Image",
        action: handleDeleteImage,
        variant: "contained",
        color: "secondary",
        tooltip: "Press Del key to remove image",
    },
];
