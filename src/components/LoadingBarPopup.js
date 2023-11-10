import { Modal, LinearProgress, Typography, Box, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export default function LoadingBar({
    isLoading,
    progress,
    title,
    message,
    logs,
    onClose,
    acknowledgement,
    setAcknowledgement,
}) {
    const logsContainerRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(isLoading);
    const [userHasScrolled, setUserHasScrolled] = useState(false);

    useEffect(() => {
        setModalOpen(isLoading);
    }, [isLoading]);

    const onUserScroll = () => {
        const container = logsContainerRef.current;
        if (container) {
            const isAtBottom =
                container.scrollHeight - container.scrollTop ===
                container.clientHeight;
            setUserHasScrolled(!isAtBottom);
        }
    };

    useEffect(() => {
        const container = logsContainerRef.current;
        if (container) {
            container.addEventListener("scroll", onUserScroll);

            return () => {
                container.removeEventListener("scroll", onUserScroll);
            };
        }
    }, []);

    useEffect(() => {
        const container = logsContainerRef.current;
        if (container && !userHasScrolled) {
            container.scrollTop = container.scrollHeight;
        }
    }, [logs, userHasScrolled]);

    const handleClose = () => {
        setModalOpen(false);
        setAcknowledgement(false);
        onClose && onClose();
    };

    return (
        <Box sx={{ margin: "auto", p: 2 }}>
            <Modal
                open={modalOpen || acknowledgement}
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
                        bgcolor: "background.paper",
                        boxShadow: 3,
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
                    {logs && (
                        <Box
                            ref={logsContainerRef}
                            sx={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                borderRadius: 2,
                                boxShadow: 1,
                                border: "1px solid",
                                padding: 1,
                            }}
                        >
                            {logs.map((status, index) => (
                                <Typography key={index} variant="body2">
                                    {status}
                                </Typography>
                            ))}
                        </Box>
                    )}
                    {progress === 100 && acknowledgement != undefined && (
                        <Box mt={2} textAlign="center">
                            <Button variant="contained" onClick={handleClose}>
                                OK
                            </Button>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
