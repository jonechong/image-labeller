import { Card, CardMedia, Typography } from "@mui/material";

export default function ImageView({ currentImage }) {
    return (
        <>
            {currentImage && (
                <Card
                    sx={{
                        maxWidth: "100%",
                        boxShadow: 3, // Adjusts the shadow of the card
                        border: "1px solid #ccc", // Adds a border
                        borderRadius: 1, // Adjusts the border radius
                        margin: "auto", // Centers the card
                        textAlign: "center",
                    }}
                >
                    <CardMedia
                        component="img"
                        image={currentImage}
                        alt="Loaded Image"
                        sx={{
                            maxHeight: 500,
                            maxWidth: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Card>
            )}
        </>
    );
}
