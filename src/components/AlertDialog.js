import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

export default function AlertDialog({
    dialogOpen,
    setDialogOpen,
    dialogMessage,
    dialogTitle,
}) {
    return (
        <Dialog open={dialogOpen}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>{dialogMessage}</DialogContent>
            <Button
                onClick={() => {
                    setDialogOpen(false);
                }}
            >
                OK
            </Button>
        </Dialog>
    );
}
