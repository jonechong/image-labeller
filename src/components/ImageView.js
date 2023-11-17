import { Card, CardMedia } from "@mui/material";

export default function ImageView({ currentImage }) {
    return (
        <>
            <Card
                sx={{
                    width: "100%",
                    boxShadow: 3, // Adjusts the shadow of the card
                    border: "1px solid #ccc", // Adds a border
                    borderRadius: 1, // Adjusts the border radius
                    margin: "auto", // Centers the card
                    textAlign: "center",
                    height: "60vh",
                }}
            >
                <CardMedia
                    component="img"
                    image={currentImage}
                    alt="Loaded Image"
                    sx={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                    }}
                />
            </Card>
        </>
    );
}
