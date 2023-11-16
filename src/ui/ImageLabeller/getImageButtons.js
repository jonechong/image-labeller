export const getImageButtons = (
    showPrevImage,
    showNextImage,
    handleDeleteImage
) => [
    {
        label: "Previous Image",
        action: showPrevImage,
        variant: "contained",
    },
    { label: "Next Image", action: showNextImage, variant: "contained" },
    {
        label: "Delete Image",
        action: handleDeleteImage,
        variant: "contained",
        color: "secondary",
    },
];
