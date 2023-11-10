import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    List,
    ListItem,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

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

    const openDirectoryDialog = async () => {
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
        }
    };

    const directoryButtons = [
        {
            label: "Select Directory",
            action: openDirectoryDialog,
            variant: "contained",
        },
    ];

    const [arrayData, setArrayData] = useState([1, 4, 5]);
    const [showAlert, setShowAlert] = useState(false);
    const [folderPath, setFolderPath] = useState("");

    const handleDirectoryChange = (event) => {
        setFolderPath(event.target.value);
    };

    const validateInputs = () => {
        if (
            !inputs.apiKey ||
            !inputs.query ||
            inputs.start === "" ||
            inputs.totalNum === "" ||
            folderPath === ""
        ) {
            setShowAlert(true);
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;

        if (type === "number") {
            const parsedValue = parseInt(value, 10);
            if (parsedValue < 0) {
                newValue = "0";
            }
        }

        setInputs({ ...inputs, [name]: newValue });
    };
    const handleSubmit = () => {
        console.log("Submit:", inputs);
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <Box sx={{ margin: "auto", p: 2 }}>
            <TextField
                fullWidth
                label={
                    <>
                        Folder Directory
                        <span style={{ color: "red" }}>*</span>
                    </>
                }
                value={folderPath}
                onChange={handleDirectoryChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="open directory"
                                onClick={openDirectoryDialog}
                            >
                                <FolderOpenIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
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
            <AlertDialog
                dialogOpen={showAlert}
                setDialogOpen={setShowAlert}
                dialogMessage="Please fill in all required fields."
                dialogTitle="Invalid Input"
            />
        </Box>
    );
}
