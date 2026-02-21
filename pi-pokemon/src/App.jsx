import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import DetailPage from "./components/DetailPage";
import Form from "./components/Form";
import TutorialPage from "./components/TutorialPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/create" element={<Form />} />
        <Route path="/tutorial" element={<TutorialPage />} />
      </Routes>
    </Router>
  );
};

export default App;