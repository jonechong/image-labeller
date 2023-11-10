import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import DirectoryBrowser from "../components/DirectoryBrowser";

export default function ImageDownloader() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        newFolderName: "",
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
        {
            label: (
                <>
                    New folder name (name of your food)
                    <span style={{ color: "red" }}>*</span>
                </>
            ),
            name: "newFolderName",
            type: "text",
        },
        {
            label: (
                <>
                    API Key
                    <span style={{ color: "red" }}>*</span>
                </>
            ),
            name: "apiKey",
            type: "text",
        },
        {
            label: (
                <>
                    Query
                    <span style={{ color: "red" }}>*</span>
                </>
            ),
            name: "query",
            type: "text",
        },
        {
            label: (
                <>
                    Start Index (leave 0 if unknown)
                    <span style={{ color: "red" }}>*</span>
                </>
            ),
            name: "start",
            type: "number",
        },
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

    const [arrayData, setArrayData] = useState([]);
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
            folderPath === "" ||
            inputs.newFolderName === ""
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
        if (!validateInputs()) return;
        window.api
            .fetchImageUrls(
                inputs.apiKey,
                inputs.query,
                inputs.start,
                inputs.totalNum,
                inputs.gl !== "" ? inputs.gl : undefined,
                inputs.hl !== "" ? inputs.hl : undefined,
                inputs.cx !== "" ? inputs.cx : undefined,
                inputs.userAgent !== "" ? inputs.userAgent : undefined
            )
            .then((response) => {
                setArrayData(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (arrayData.length > 0) {
            const downloadDirectory =
                folderPath + "/" + inputs.newFolderName.replace(/ /g, "_");
            window.api
                .downloadImages(
                    arrayData,
                    downloadDirectory,
                    inputs.start,
                    inputs.userAgent !== "" ? inputs.userAgent : undefined
                )
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [arrayData]);

    return (
        <Box sx={{ margin: "auto", p: 2 }}>
            <DirectoryBrowser
                folderPath={folderPath}
                handleDirectoryChange={handleDirectoryChange}
                openDirectoryDialog={openDirectoryDialog}
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
                    onClick={() => {
                        navigate("/");
                    }}
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
