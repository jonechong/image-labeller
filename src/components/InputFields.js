import React from "react";
import { TextField, Tooltip, InputAdornment } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function InputFields({ fields, values, onChange }) {
    return (
        <>
            {fields.map((field, index) => (
                <TextField
                    key={index}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={values[field.name]}
                    onChange={onChange}
                    onKeyDown={field.onKeyDown}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: field.tooltip && (
                            <InputAdornment position="end">
                                <Tooltip
                                    title={field.tooltip || ""}
                                    enterDelay={100}
                                    leaveDelay={200}
                                >
                                    <InfoIcon style={{ cursor: "pointer" }} />
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            ))}
        </>
    );
}
