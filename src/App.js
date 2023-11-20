import "./App.css";
import SplashScreen from "./pages/SplashScreen";
import ImageLabeller from "./pages/ImageLabeller";
import ImageDownloader from "./pages/ImageDownloader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoundingBoxDrawer from "./components/ImageLabeller/BoundingBox";

function App() {
    const handleAnnotationComplete = (rectangles) => {
        console.log("Bounding Box Annotations:", rectangles);
    };

    return (
        <div style={{ padding: 100 }}>
            <BoundingBoxDrawer
                imageUrl="path_to_your_image.jpg"
                onAnnotationComplete={handleAnnotationComplete}
            />
        </div>
    );
    // return (
    //     <Router style={{ display: "flex", flex: 1 }}>
    //         <Routes>
    //             <Route path="/" element={<SplashScreen />} />
    //             <Route path="/label" element={<ImageLabeller />} />
    //             <Route path="/download" element={<ImageDownloader />} />
    //         </Routes>
    //     </Router>
    // );
}

export default App;
