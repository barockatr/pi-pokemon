import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import DetailPage from "./components/DetailPage";
import Form from "./components/Form";
import NavBar from "./components/NavBar";
import DeckBuilderDock from "./components/DeckBuilderDock";
import DuelArenaContainer from "./components/DuelArena/DuelArenaContainer";
import ErrorScreen from "./components/ErrorScreen";

const AppContent = () => {
  const location = useLocation();
  // Module 25: Hide UI elements on Landing Page for a clean cinematic view
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!isLandingPage && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/create" element={<Form />} />
        <Route path="/arena" element={<DuelArenaContainer />} />
      </Routes>
      {!isLandingPage && <DeckBuilderDock />}
      <ErrorScreen />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;