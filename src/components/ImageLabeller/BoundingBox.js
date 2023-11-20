import React, { useState, useRef } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";

const BoundingBoxDrawer = ({ imageUrl, onAnnotationComplete }) => {
    const [image] = useImage(imageUrl);
    const [rectangles, setRectangles] = useState([]);
    const newRect = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        newRect.current = { x: pos.x, y: pos.y, width: 0, height: 0 };
        setRectangles([...rectangles, newRect.current]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const rect = newRect.current;
        rect.width = point.x - rect.x;
        rect.height = point.y - rect.y;

        setRectangles(rectangles.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        const lastRect = rectangles[rectangles.length - 1];
        if (lastRect) {
            console.log(`Bounding Box #${rectangles.length}:`, lastRect);
        }
        onAnnotationComplete(rectangles);
    };

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
        >
            <Layer>
                <Image image={image} />
                {rectangles.map((rect, i) => (
                    <Rect
                        key={i}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        fillEnabled={false}
                        stroke="red"
                        strokeWidth={2}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default BoundingBoxDrawer;
