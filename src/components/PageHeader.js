import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PageHeader({ title, navigateFunc }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <IconButton onClick={navigateFunc}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">{title}</Typography>
        </Box>
    );
}
