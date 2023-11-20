import React, { useState, useCallback } from "react";
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Tooltip,
    InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Info from "@mui/icons-material/Info";

const ItemTypes = {
    LABEL: "label",
};

function DraggableLabel({
    label,
    index,
    moveLabel,
    selectedLabels,
    onLabelChange,
    onDelete,
}) {
    const [, drag] = useDrag(
        () => ({
            type: ItemTypes.LABEL,
            item: { label, index },
        }),
        [label, index]
    );

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.LABEL,
            hover(item, monitor) {
                if (item.index !== index) {
                    moveLabel(item.index, index);
                    item.index = index;
                }
            },
        }),
        [index, moveLabel]
    );

    return (
        <Box
            ref={(node) => drag(drop(node))}
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
                        onChange={(e) => onLabelChange(label, e.target.checked)}
                    />
                }
                label={label}
            />
            <IconButton onClick={() => onDelete(label)} size="small">
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}

export default function LabelManager({
    labels,
    setLabels,
    selectedLabels,
    setSelectedLabels,
    onLabelChange,
    tooltipMessage,
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

        if (selectedLabels.has(labelToDelete)) {
            const updatedSelectedLabels = new Set(selectedLabels);
            updatedSelectedLabels.delete(labelToDelete);
            setSelectedLabels(updatedSelectedLabels);
        }
    };

    const moveLabel = useCallback(
        (dragIndex, hoverIndex) => {
            const newLabels = Array.from(labels);
            const [draggedLabel] = newLabels.splice(dragIndex, 1);
            newLabels.splice(hoverIndex, 0, draggedLabel);
            setLabels(new Set(newLabels));
        },
        [labels, setLabels]
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    display: "flex",
                    alignContent: "center",
                    flexDirection: "column",
                    maxHeight: "60vh",
                }}
            >
                <Box sx={{ display: "flex", gap: 1, paddingLeft: 1 }}>
                    <TextField
                        label="New Label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: tooltipMessage && (
                                <InputAdornment position="end">
                                    <Tooltip
                                        title={tooltipMessage}
                                        enterDelay={100}
                                        leaveDelay={200}
                                    >
                                        <Info style={{ cursor: "pointer" }} />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
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
                        overflowY: "auto",
                        paddingLeft: 2,
                        paddingRight: 2,
                    }}
                >
                    {Array.from(labels).map((label, index) => (
                        <DraggableLabel
                            key={label}
                            label={label}
                            index={index}
                            moveLabel={moveLabel}
                            selectedLabels={selectedLabels}
                            onLabelChange={onLabelChange}
                            onDelete={handleDeleteLabel}
                        />
                    ))}
                </Box>
            </Box>
        </DndProvider>
    );
}
