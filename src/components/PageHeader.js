import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Info from "@mui/icons-material/Info";

export default function PageHeader({ title, navigateFunc, tooltip }) {
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6">{title}</Typography>
                {tooltip && (
                    <Tooltip title={tooltip}>
                        <IconButton size="small">
                            <Info fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
}
