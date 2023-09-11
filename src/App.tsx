import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import CameraPage from "./pages/camera";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/camera" element={<CameraPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
