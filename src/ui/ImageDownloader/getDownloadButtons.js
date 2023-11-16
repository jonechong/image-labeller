export const getDownloadButtons = (handleSubmit, navigate) => [
    {
        label: "Submit",
        action: handleSubmit,
        variant: "contained",
        color: "primary",
    },
    {
        label: "Cancel",
        action: () => navigate("/"),
        variant: "contained",
        color: "secondary",
    },
];
