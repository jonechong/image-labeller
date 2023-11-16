export const getLoadImageButtons = (handleImageLoad, navigate) => [
    { label: "Load Images", action: handleImageLoad, variant: "contained" },
    {
        label: "Cancel",
        action: () => {
            navigate("/");
        },
        variant: "contained",
        color: "secondary",
    },
];
