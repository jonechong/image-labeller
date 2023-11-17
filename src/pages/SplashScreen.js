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
            }}
        >
            <Typography variant="h4" gutterBottom>
                Eymage
            </Typography>
            <Box display="flex" justifyContent="center" gap={theme.spacing(2)}>
                <Button
                    variant="contained"
                    onClick={() => navigate("/download")}
                    sx={{
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3],
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
                    }}
                >
                    Label Images
                </Button>
            </Box>
        </Box>
    );
}
