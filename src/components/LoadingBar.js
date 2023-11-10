import {
    Modal,
    Backdrop,
    LinearProgress,
    Typography,
    Box,
    useTheme,
} from "@mui/material";

export default function LoadingBar({ isLoading, progress, title, message }) {
    const theme = useTheme();
    return (
        <Box sx={{ margin: "auto", p: 2 }}>
            <Modal
                open={isLoading}
                closeAfterTransition
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "80%",
                        maxWidth: 500,
                        bgcolor: "background.paper", // Sets a background color based on the theme
                        boxShadow: 3, // Adds a shadow for depth
                        p: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ my: 2 }}
                    />
                    <Typography variant="body2" gutterBottom>
                        {message}
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
}
