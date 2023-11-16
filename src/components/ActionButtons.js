import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

export default function ActionButtons({ buttonsProps }) {
    return (
        <>
            {buttonsProps.map((button, index) =>
                button.tooltip ? (
                    <Tooltip key={index} title={button.tooltip}>
                        <Button
                            key={index}
                            variant={button.variant}
                            {...(button.color && { color: button.color })}
                            onClick={button.action}
                            sx={{ margin: 1 }}
                        >
                            {button.label}
                        </Button>
                    </Tooltip>
                ) : (
                    <Button
                        key={index}
                        variant={button.variant}
                        {...(button.color && { color: button.color })}
                        onClick={button.action}
                        sx={{ margin: 1 }}
                    >
                        {button.label}
                    </Button>
                )
            )}
        </>
    );
}
