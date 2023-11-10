import React, { useState } from "react";
import { Box, TextField, Button, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ImageDownloader() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        apiKey: "",
        query: "",
        start: 0,
        totalNum: 10,
        gl: "",
        hl: "",
        cx: "",
        userAgent: "",
    });

    const fieldsConfig = [
        { label: "API Key", name: "apiKey", type: "text" },
        { label: "Query", name: "query", type: "text" },
        { label: "Start (leave 0 if unknown)", name: "start", type: "number" },
        {
            label: 'Geolocation for search engine (default "SG")',
            name: "gl",
            type: "text",
        },
        {
            label: 'Host language for search engine (default "EN")',
            name: "hl",
            type: "text",
        },
        {
            label: "Search Engine (leave blank if unknown)",
            name: "cx",
            type: "text",
        },
        {
            label: "User Agent (leave blank if unknown)",
            name: "userAgent",
            type: "text",
        },
    ];

    const [arrayData, setArrayData] = useState([1, 4, 5]);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Submit:", inputs);
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <Box sx={{ margin: "auto", p: 2 }}>
            {fieldsConfig.map(({ label, name, type }, index) => (
                <TextField
                    key={index}
                    label={label}
                    name={name}
                    type={type}
                    value={inputs[name]}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            ))}
            <Box textAlign="center" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{ ml: 2 }}
                >
                    Cancel
                </Button>
            </Box>
            <Box mt={2}>
                <List>
                    {arrayData.map((item, index) => (
                        <ListItem key={index}>{item}</ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

