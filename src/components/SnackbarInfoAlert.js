import React, { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export default function SnackbarInfoAlert({
    alertOpen,
    onClose,
    duration,
    alertMessage,
    severity = "info",
    style,
}) {
    const [open, setOpen] = useState(alertOpen);

    useEffect(() => {
        if (alertOpen) {
            setOpen(true); // Open the Snackbar when alertOpen prop is true
        }
    }, [alertOpen]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false); // Close the Snackbar locally
        onClose(); // Call the onClose prop to update the parent state
    };

    return (
        <Snackbar
            open={open} // Use local state
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            style={style}
        >
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={severity}
                sx={{ width: "100%" }}
            >
                {alertMessage}
            </MuiAlert>
        </Snackbar>
    );
}
