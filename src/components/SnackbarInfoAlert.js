import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export default function SnackbarInfoAlert({
    alertOpen,
    onClose,
    duration,
    alertMessage,
}) {
    return (
        <Snackbar
            open={alertOpen}
            autoHideDuration={duration}
            onClose={onClose}
        >
            <MuiAlert onClose={onClose} severity="info" sx={{ width: "100%" }}>
                {alertMessage}
            </MuiAlert>
        </Snackbar>
    );
}
