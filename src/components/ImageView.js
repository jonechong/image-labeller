import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import { Card } from "@mui/material";
import SnackbarInfoAlert from "./SnackbarInfoAlert";

export default function ImageView({
    currentImage,
    boxes,
    setBoxes,
    labelColors,
    drawingLabel,
}) {
    const [image] = useImage(currentImage);
    const [newBox, setNewBox] = useState(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const cardRef = useRef(null);

    const createNewBox = () => {
        if (newBox) {
            setBoxes([...boxes, { ...newBox, label: drawingLabel }]);
            setNewBox(null);
        }
    };

    const undoLastBox = useCallback(() => {
        setBoxes(boxes.slice(0, -1)); // Removes the last box
    }, [boxes, setBoxes]);

    // mouse handlers
    const handleMouseDown = (e) => {
        if (!drawingLabel) {
            // No label selected, show alert
            setAlertMessage("Please select a label before drawing.");
            setShowAlert(true);
            return;
        }

        if (e.evt.button === 0) {
            // Proceed with creating a new box
            const { x, y } = e.target.getStage().getPointerPosition();
            setNewBox({ x, y, width: 0, height: 0, label: drawingLabel });
        }
    };

    const handleMouseMove = (e) => {
        if (!newBox) {
            return;
        }
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        const updatedBox = {
            ...newBox,
            width: x - newBox.x,
            height: y - newBox.y,
        };
        setNewBox(updatedBox);
    };

    const handleRightClick = (e) => {
        e.evt.preventDefault(); // Prevents default right-click menu
        undoLastBox();
    };

    // useEffects
    useEffect(() => {
        // Function to update stage size based on the card size and image aspect ratio
        const updateSize = () => {
            if (cardRef.current && image) {
                const cardWidth = cardRef.current.offsetWidth;
                const cardHeight = cardRef.current.offsetHeight;
                const aspectRatio = image.width / image.height;

                let newWidth, newHeight;
                if (cardWidth / cardHeight > aspectRatio) {
                    // Card is wider than image
                    newHeight = cardHeight;
                    newWidth = cardHeight * aspectRatio;
                } else {
                    // Card is taller than image
                    newWidth = cardWidth;
                    newHeight = cardWidth / aspectRatio;
                }

                setStageSize({ width: newWidth, height: newHeight });
            }
        };

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, [image]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if 'Z' is pressed along with Command (on Mac) or Control (on Windows/Linux)
            if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault(); // Prevents the default action of the key press
                undoLastBox();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [boxes, undoLastBox]);

    return (
        <>
            <Card
                ref={cardRef}
                sx={{
                    width: "100%",
                    boxShadow: 3,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    margin: "auto",
                    textAlign: "center",
                    height: "60vh",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={createNewBox}
                    onMouseLeave={createNewBox}
                    onContextMenu={handleRightClick}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }} // Center the stage
                >
                    <Layer>
                        <Image
                            image={image}
                            width={stageSize.width}
                            height={stageSize.height}
                        />
                        {boxes.map((box, i) => {
                            const color = labelColors[box.label] || "black";
                            return (
                                <Rect
                                    key={i}
                                    x={box.x}
                                    y={box.y}
                                    width={box.width}
                                    height={box.height}
                                    fillEnabled={false}
                                    stroke={color}
                                    strokeWidth={2}
                                />
                            );
                        })}
                        {newBox && (
                            <Rect
                                x={newBox.x}
                                y={newBox.y}
                                width={newBox.width}
                                height={newBox.height}
                                fillEnabled={false}
                                stroke={labelColors[drawingLabel] || "black"}
                                strokeWidth={2}
                            />
                        )}
                    </Layer>
                </Stage>
            </Card>
            <SnackbarInfoAlert
                alertOpen={showAlert}
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    setShowAlert(false);
                }}
                duration={3000}
                alertMessage={alertMessage}
            />
        </>
    );
}
