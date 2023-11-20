import { Box, Typography } from "@mui/material";

export default function ImageHeader({ header, subheader }) {
    return (
        <Box textAlign="center" my={2}>
            <Typography
                variant="h6"
                sx={{
                    mx: "25%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {header}
            </Typography>
            <Typography
                sx={{
                    mx: "10%",
                    maxWidth: "80%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {subheader}
            </Typography>
        </Box>
    );
}
