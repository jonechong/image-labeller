import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import { Card } from "@mui/material";

export default function ImageView({ currentImage }) {
    const [image] = useImage(currentImage);
    const [boxes, setBoxes] = useState([]);
    const [newBox, setNewBox] = useState(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const cardRef = useRef(null);

    const createNewBox = () => {
        if (newBox) {
            setBoxes([...boxes, newBox]);
            setNewBox(null);
        }
    };

    const undoLastBox = () => {
        setBoxes(boxes.slice(0, -1)); // Removes the last box
    };

    // mouse handlers
    const handleMouseDown = (e) => {
        if (e.evt.button === 0) {
            // Ensure it's the left mouse button
            const { x, y } = e.target.getStage().getPointerPosition();
            setNewBox({ x, y, width: 0, height: 0 });
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
        console.log(boxes);
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

    return (
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
                    {boxes.map((box, i) => (
                        <Rect
                            key={i}
                            x={box.x}
                            y={box.y}
                            width={box.width}
                            height={box.height}
                            fillEnabled={false}
                            stroke="red"
                            strokeWidth={2}
                        />
                    ))}
                    {newBox && (
                        <Rect
                            x={newBox.x}
                            y={newBox.y}
                            width={newBox.width}
                            height={newBox.height}
                            fillEnabled={false}
                            stroke="red"
                            strokeWidth={2}
                        />
                    )}
                </Layer>
            </Stage>
        </Card>
    );
}
