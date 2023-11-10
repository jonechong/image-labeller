import { Button, Box } from "@mui/material";

function SplashScreen({ onOptionSelect }) {
    return (
        <Box textAlign="center" p={4}>
            <Button variant="contained" onClick={() => onOptionSelect("label")}>
                Label Images
            </Button>
            <Button
                variant="contained"
                onClick={() => onOptionSelect("download")}
            >
                Download Images
            </Button>
        </Box>
    );
}
