import { Button, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SplashScreen({ onOptionSelect }) {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            sx={{
                height: "100%",
                backgroundColor: theme.palette.background.default,
                backgroundImage: 'url("background-image-url.jpg")', // Add a relevant background image
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Eymage
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: theme.spacing(3) }}>
                Best image dataset creation tool this world's ever seen
            </Typography>
            <Box display="flex" justifyContent="center" gap={theme.spacing(2)}>
                <Button
                    variant="contained"
                    onClick={() => navigate("/download")}
                    sx={{
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3],
                        padding: theme.spacing(2),
                        fontSize: "large",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark, // Change for hover effect
                        },
                    }}
                >
                    Download Images
                </Button>
                <Button
                    variant="contained"
                    onClick={() => navigate("/label")}
                    sx={{
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3],
                        padding: theme.spacing(2),
                        fontSize: "large",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark, // Change for hover effect
                        },
                    }}
                >
                    Label Images
                </Button>
            </Box>
        </Box>
    );
}
