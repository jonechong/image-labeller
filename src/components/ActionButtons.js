import { Button } from "@mui/material";

export default function ActionButtons({ buttonsProps }) {
    return (
        <>
            {buttonsProps.map((button, index) => (
                <Button
                    key={index}
                    variant={button.variant}
                    {...(button.color && { color: button.color })}
                    onClick={button.action}
                    sx={{ margin: 1 }}
                >
                    {button.label}
                </Button>
            ))}
        </>
    );
}