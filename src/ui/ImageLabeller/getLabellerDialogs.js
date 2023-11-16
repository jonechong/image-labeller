export const getLabellerDialogs = (
    imagesDeleted,
    invalidDirectory,
    noImages,
    setImagesDeleted,
    setInvalidDirectory,
    setNoImages
) => [
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
