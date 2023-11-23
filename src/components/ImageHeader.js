import { Box, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

export default function ImageHeader({ header, subheader, tooltipMessage }) {
    return (
        <Box textAlign="center" my={2} sx={{ justifyContent: "center" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    {header}
                </Typography>
                {tooltipMessage && (
                    <Tooltip title={tooltipMessage}>
                        <InfoIcon
                            fontSize="medium"
                            style={{ cursor: "pointer" }}
                        />
                    </Tooltip>
                )}
            </Box>
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
