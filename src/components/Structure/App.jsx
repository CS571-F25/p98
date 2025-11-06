import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cover from "../cover_UI/Cover.jsx";
import Layout from "./Layout.jsx";
import HomePgae from "../Pages/HomePgae.jsx";
import "./layout.css";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleStart = () => {
    setIntroComplete(true);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className={`app-home ${introComplete ? "app-home-visible" : ""}`}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePgae />} />
            </Route>
          </Routes>
        </div>
        <Cover onStart={handleStart} introComplete={introComplete} />
      </div>
    </BrowserRouter>
  );
}
