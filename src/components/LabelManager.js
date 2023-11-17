import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function LabelManager({
    labels,
    setLabels,
    selectedLabels,
    onLabelChange,
}) {
    const [newLabel, setNewLabel] = useState("");

    const addLabel = () => {
        if (newLabel) {
            setLabels(new Set(labels).add(newLabel));
            setNewLabel("");
        }
    };

    const handleDeleteLabel = (labelToDelete) => {
        const updatedLabels = new Set(labels);
        updatedLabels.delete(labelToDelete);
        setLabels(updatedLabels);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignContent: "center",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    label="New Label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                />
                <Button
                    sx={{ margin: 1 }}
                    onClick={addLabel}
                    variant="contained"
                >
                    Add
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: 500,
                    overflowY: "auto",
                }}
            >
                {Array.from(labels).map((label) => (
                    <Box
                        key={label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedLabels.has(label)}
                                    onChange={(e) =>
                                        onLabelChange(label, e.target.checked)
                                    }
                                />
                            }
                            label={label}
                        />
                        <IconButton
                            onClick={() => handleDeleteLabel(label)}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
