import "./App.css";
import SplashScreen from "./pages/SplashScreen";
import ImageLabeller from "./pages/ImageLabeller";
import ImageDownloader from "./pages/ImageDownloader";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        // <div>HI!!</div>
        <Router style={{ display: "flex", flex: 1 }}>
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/label" element={<ImageLabeller />} />
                <Route path="/download" element={<ImageDownloader />} />
            </Routes>
        </Router>
    );
}

export default App;
