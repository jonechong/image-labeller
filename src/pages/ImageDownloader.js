import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import components
import AlertDialog from "../components/AlertDialog";
import DirectoryBrowser from "../components/DirectoryBrowser";
import ActionButtons from "../components/ActionButtons";
import LoadingBar from "../components/LoadingBarPopup";
import InputFields from "../components/InputFields";
import PageHeader from "../components/PageHeader";

// Import UI
import { getImageDownloaderFields } from "../ui/ImageDownloader/getImageDownloaderFields";
import { getDownloadButton } from "../ui/ImageDownloader/getDownloadButton";

// Import icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ImageDownloader() {
    const navigate = useNavigate();
    const [arrayData, setArrayData] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [folderPath, setFolderPath] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStatuses, setDownloadStatuses] = useState([]);
    const [downloadAcknowledged, setDownloadAcknowledged] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchProgress, setFetchProgress] = useState(0);
    const [fetchStatuses, setFetchStatuses] = useState([]);
    const [fetchAcknowledged, setFetchAcknowledged] = useState(undefined);
    const [inputs, setInputs] = useState({
        newFolderName: "",
        apiKey: "",
        query: "",
        start: 0,
        totalNum: 200,
        gl: "",
        hl: "",
        cx: "",
        userAgent: "",
    });
    const inputsRef = useRef(inputs);
    const folderPathRef = useRef(folderPath);

    const openDirectoryDialog = async () => {
        const folderPath = await window.api.openDirectoryDialog();
        if (folderPath) {
            setFolderPath(folderPath);
        }
    };
    const handleDirectoryChange = (event) => {
        setFolderPath(event.target.value);
    };

    const validateInputs = useCallback(() => {
        const illegalCharacterRegex = /[^a-zA-Z0-9 ]/;
        if (
            !inputs.apiKey ||
            !inputs.query ||
            inputs.start === "" ||
            inputs.totalNum === "" ||
            folderPath === "" ||
            inputs.newFolderName === ""
        ) {
            setAlertMessage("Please fill in all required fields.");
            setShowAlert(true);
            return false;
        } else if (illegalCharacterRegex.test(inputs.newFolderName)) {
            setAlertMessage(
                "Invalid folder name. Please use only alphanumeric characters and spaces."
            );
            setShowAlert(true);
            return false;
        }
        return true;
    }, [inputs, folderPath]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;

        if (type === "number") {
            const parsedValue = parseInt(value, 10);
            if (parsedValue < 0) {
                newValue = "0";
            }
            if (parsedValue > 200) {
                newValue = "200";
            }
        }

        setInputs({ ...inputs, [name]: newValue });
    };

    const handleSubmit = useCallback(async () => {
        if (!validateInputs()) return;
        console.log(window.api.fetchImageUrls);
        window.api
            .validateDirectory(folderPath)
            .then((isValidDirectory) => {
                if (!isValidDirectory) {
                    setAlertMessage(
                        "The selected directory does not exist. Please choose a valid directory."
                    );
                    setShowAlert(true);
                    return;
                }
                setIsFetching(true);
                const apiKey = inputs.apiKey.trim();
                const query = inputs.query.trim();
                const gl = inputs.gl.trim();
                const hl = inputs.hl.trim();
                const cx = inputs.cx.trim();
                const userAgent = inputs.userAgent.trim();
                window.api
                    .fetchImageUrls(
                        apiKey,
                        query,
                        inputs.start,
                        inputs.totalNum,
                        gl !== "" ? gl : undefined,
                        hl !== "" ? hl : undefined,
                        cx !== "" ? cx : undefined,
                        userAgent !== "" ? userAgent : undefined
                    )
                    .then((response) => {
                        if (response.length > 0) {
                            setArrayData(response);
                            setFetchAcknowledged(undefined);
                            setFetchProgress(0);
                        } else {
                            setFetchAcknowledged(true);
                            setFetchProgress(100);
                        }
                        setIsFetching(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        setIsFetching(false);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        // const dummyData = [
        //     "https://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     "https://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     "https://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     "https://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     "httpds://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     "httpds://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     "https://images.pexels.com/photos/7372338/pexels-photo-7372338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        // ];
        // setArrayData(dummyData);
        // setIsFetching(false);
    }, [inputs, folderPath, validateInputs]);

    const handleDownloadProgress = useCallback(
        (data) => {
            if (data && typeof data.progress === "number") {
                setDownloadProgress(Math.round(data.progress * 100));
                setDownloadStatuses((prevStatuses) => {
                    const newStatuses = [...prevStatuses];
                    newStatuses[data.imageIndex] = data.message;
                    return newStatuses;
                });
            }
        },
        [setDownloadProgress, setDownloadStatuses]
    );

    const handleFetchProgress = useCallback(
        (data) => {
            if (data && typeof data.progress === "number") {
                setFetchProgress(Math.round(data.progress * 100));
                if (data.message) {
                    setFetchStatuses((prevStatuses) => {
                        const newStatuses = [...prevStatuses];
                        newStatuses[data.fetchIndex] = data.message;
                        return newStatuses;
                    });
                }
            }
        },
        [setFetchProgress, setFetchStatuses]
    );

    const downloadButton = getDownloadButton(handleSubmit);
    const imageDownloaderFields = getImageDownloaderFields();

    useEffect(() => {
        if (arrayData.length > 0) {
            setIsDownloading(true);
            setDownloadAcknowledged(true);
            setDownloadProgress(0);
            setDownloadStatuses([]);

            const downloadDirectory =
                folderPathRef.current +
                "/" +
                inputsRef.current.newFolderName
                    .trim()
                    .replace(/ /g, "_")
                    .toLowerCase();

            window.api
                .downloadImages(
                    arrayData,
                    downloadDirectory,
                    inputsRef.current.start,
                    inputsRef.current.userAgent !== ""
                        ? inputsRef.current.userAgent
                        : undefined
                )
                .then(() => {
                    setIsDownloading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setIsDownloading(false);
                });
        }
    }, [arrayData]);

    useEffect(() => {
        if (isDownloading) {
            window.api.receive("download-progress", handleDownloadProgress);
        }

        return () => {
            window.api.removeListener(
                "download-progress",
                handleDownloadProgress
            );
        };
    }, [isDownloading, downloadAcknowledged, handleDownloadProgress]);

    useEffect(() => {
        if (isFetching) {
            window.api.receive("fetch-progress", handleFetchProgress);
        }

        return () => {
            window.api.removeListener("fetch-progress", handleFetchProgress);
        };
    }, [isFetching, fetchAcknowledged, handleFetchProgress]);

    useEffect(() => {
        setArrayData([]);
        setDownloadStatuses([]);
        setFetchStatuses([]);
    }, []);

    useEffect(() => {
        if (fetchAcknowledged) {
            setArrayData([]);
        }
        if (!fetchAcknowledged) {
            setFetchStatuses([]);
            setArrayData([]);
        }
    }, [fetchAcknowledged]);

    useEffect(() => {
        inputsRef.current = inputs;
    }, [inputs]);

    useEffect(() => {
        folderPathRef.current = folderPath;
    }, [folderPath]);

    return (
        <Box sx={{ padding: 2 }}>
            <PageHeader
                title={"Download Images"}
                navigateFunc={() => {
                    navigate("/");
                }}
            />

            <Box sx={{ width: "80%", margin: "auto" }}>
                <DirectoryBrowser
                    folderPath={folderPath}
                    handleDirectoryChange={handleDirectoryChange}
                    openDirectoryDialog={openDirectoryDialog}
                />
                <InputFields
                    fields={imageDownloaderFields}
                    values={inputs}
                    onChange={handleChange}
                />

                <Box textAlign="center" mt={2}>
                    <ActionButtons buttonsProps={downloadButton} />
                </Box>

                <AlertDialog
                    dialogOpen={showAlert}
                    setDialogOpen={setShowAlert}
                    dialogMessage={alertMessage}
                    dialogTitle="Invalid Input"
                />
                <LoadingBar
                    isLoading={isFetching}
                    progress={fetchProgress}
                    logs={fetchStatuses}
                    title="Fetching Images"
                    message="Please wait while the images are being fetched..."
                    acknowledgement={fetchAcknowledged}
                    setAcknowledgement={setFetchAcknowledged}
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
        </Box>
    );
}
