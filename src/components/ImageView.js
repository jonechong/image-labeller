import { Card, CardMedia } from "@mui/material";
export default function ImageView({ currentImage }) {
    return (
        <>
            {currentImage && (
                <Card>
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
