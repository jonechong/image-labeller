import React, { useState, useCallback } from "react";
import {
    Box,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    InputLabel,
    FormControl,
    MenuItem,
    IconButton,
    Tooltip,
    Select,
    InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import InfoIcon from "@mui/icons-material/Info";

const ItemTypes = {
    LABEL: "label",
};

function DraggableLabel({
    label,
    labelColor,
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                    sx={{
                        width: 15,
                        height: 15,
                        backgroundColor: labelColor,
                        marginRight: 1,
                        borderRadius: "50%", // Makes the box circular
                    }}
                />
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
            </Box>
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
    drawingLabel,
    setDrawingLabel,
    labelColors,
    onLabelChange,
}) {
    const [newLabel, setNewLabel] = useState("");
    const tooltipMessage = "Categories for your image";

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

    const handleDrawingLabelChange = (e) => {
        setDrawingLabel(e.target.value);
    };

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
                                        <InfoIcon
                                            style={{ cursor: "pointer" }}
                                        />
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
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <FormControl sx={{ m: 1, width: "100%" }}>
                        <InputLabel>Selected Label</InputLabel>
                        <Select
                            labelId="label-select-label"
                            id="label-select"
                            value={drawingLabel}
                            label="Selected Label"
                            onChange={handleDrawingLabelChange}
                        >
                            {Array.from(labels).map((label, index) => (
                                <MenuItem key={index} value={label}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Tooltip title={"This label is for your drawing"}>
                        <InfoIcon
                            fontSize="medium"
                            style={{ cursor: "pointer" }}
                        />
                    </Tooltip>
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
                            labelColor={labelColors[label]}
                            onLabelChange={onLabelChange}
                            onDelete={handleDeleteLabel}
                        />
                    ))}
                </Box>
            </Box>
        </DndProvider>
    );
}
