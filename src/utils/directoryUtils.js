const getBasePath = (path) => {
    const pathSegments = path.split("/");
    pathSegments.pop();
    const basePath = pathSegments.join("/");
    return basePath;
};

const getFileName = (path) => {
    const pathSegments = path.split("/");
    const fileName = pathSegments[pathSegments.length - 1];
    return fileName;
};

const extractFilename = (path) => {
    return path.split("/").pop().split("\\").pop(); // Handles both UNIX and Windows paths
};

export { getBasePath, getFileName, extractFilename };
