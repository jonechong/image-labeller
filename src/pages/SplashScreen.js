import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SplashScreen({ onOptionSelect }) {
    const navigate = useNavigate();

    return (
        <Box
            textAlign="center"
            p={4}
            display="flex"
            justifyContent="center"
            gap={2}
        >
            <Button variant="contained" onClick={() => navigate("/download")}>
                Download Images
            </Button>
            <Button variant="contained" onClick={() => navigate("/label")}>
                Label Images
            </Button>
        </Box>
    );
}
