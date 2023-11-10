import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    CircularProgress,
    LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import DirectoryBrowser from "../components/DirectoryBrowser";
import ActionButtons from "../components/ActionButtons";
import LoadingBar from "../components/LoadingBar";

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
            label: (
                <>
                    Total number of images
                    <span style={{ color: "red" }}>*</span>
                </>
            ),
            name: "totalNum",
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStatuses, setDownloadStatuses] = useState([]);
    const [downloadAcknowledged, setDownloadAcknowledged] = useState(false);

    const [fetchProgress, setFetchProgress] = useState(0);

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
        setIsFetching(true);
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
                setIsFetching(false);
            })
            .catch((error) => {
                console.log(error);
                setIsFetching(false);
            });
    };

    const downloadButtons = [
        {
            label: "Submit",
            action: handleSubmit,
            variant: "contained",
            color: "primary",
        },
        {
            label: "Cancel",
            action: () => {
                navigate("/");
            },
            variant: "contained",
            color: "secondary",
        },
    ];

    useEffect(() => {
        if (arrayData.length > 0) {
            setIsDownloading(true);
            setDownloadAcknowledged(true);
            setDownloadProgress(0);
            setDownloadStatuses([]);

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
                    setIsDownloading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsDownloading(false);
                });
        }
    }, [arrayData]);

    useEffect(() => {
        const handleDownloadProgress = (data) => {
            if (data && typeof data.progress === "number") {
                setDownloadProgress(Math.round(data.progress * 100));
                setDownloadStatuses((prevStatuses) => {
                    const newStatuses = [...prevStatuses];
                    newStatuses[data.imageIndex] = data.message;
                    return newStatuses;
                });
            }
        };

        if (isDownloading) {
            window.api.receive("download-progress", handleDownloadProgress);
        }

        return () => {
            window.api.removeListener(
                "download-progress",
                handleDownloadProgress
            );
        };
    }, [isDownloading]);

    useEffect(() => {
        const handleFetchProgress = (data) => {
            if (data && typeof data.progress === "number") {
                setFetchProgress(Math.round(data.progress * 100));
            }
        };

        if (isFetching) {
            window.api.receive("fetch-progress", handleFetchProgress);
        }

        return () => {
            window.api.removeListener("fetch-progress", handleFetchProgress);
        };
    }, [isFetching]);

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
                <ActionButtons buttonsProps={downloadButtons} />
            </Box>

            <AlertDialog
                dialogOpen={showAlert}
                setDialogOpen={setShowAlert}
                dialogMessage="Please fill in all required fields."
                dialogTitle="Invalid Input"
            />
            <LoadingBar
                isLoading={isFetching}
                progress={fetchProgress}
                title="Fetching Images"
                message="Please wait while the images are being fetched..."
            />
            <LoadingBar
                isLoading={isDownloading}
                progress={downloadProgress}
                title="Downloading Images"
                message="Please wait while the images are being downloaded..."
                logs={downloadStatuses}
                acknowledgement={downloadAcknowledged}
                setAcknowledgement={setDownloadAcknowledged}
            />
        </Box>
    );
}
