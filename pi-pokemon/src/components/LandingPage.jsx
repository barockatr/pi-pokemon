import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // MODULE 27: States for the explosive sequence
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // MODULE 26: Parallax Background coordinates
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Calculate opposite subtle movement for background Parallax
    const { clientX, clientY, innerWidth, innerHeight } = window;
    const xPos = (clientX / innerWidth - 0.5) * 40; // max 20px displacement
    const yPos = (clientY / innerHeight - 0.5) * 40;
    setBgPosition({ x: -xPos, y: -yPos });
  };

  const handleButtonClick = () => {
    if (isCapturing) return; // Prevent double clicks

    setIsCapturing(true);

    // After 500ms of aggressive shaking, trigger the FLASH
    setTimeout(() => {
      setShowFlash(true);

      // After the flash expands (approx 600ms), navigate to home
      setTimeout(() => {
        navigate("/home");
      }, 600);

    }, 500);
  };

  return (
    <div
      className="landing-wrapper"
      onMouseMove={handleMouseMove}
    >
      {/* MODULE 26: Vigilant Background Parallax Layer */}
      <div
        className="landing-vigilant-bg"
        style={{ transform: `translate(${bgPosition.x}px, ${bgPosition.y}px)` }}
      />

      {/* Floating Particles Overlay */}
      <div className="landing-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle-mote"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              x: [null, Math.random() * 100 - 50],
              opacity: [null, 0.8, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <h1 className="landing-title">PI Pokémon TCG</h1>

      {/* MODULE 27: THE POKEBALL */}
      <button
        className={`pokeball-cta ${isCapturing ? 'shaking-ball' : ''}`}
        onClick={handleButtonClick}
        title="Enter the TCG Dashboard"
        disabled={isCapturing}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
          alt="Pokeball Enter"
          className="pokeball-img"
        />
      </button>

      <p className="landing-subtitle">Click the Pokéball to start</p>

      {/* THE FLASH (MODULE 27) */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="capture-flash"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 50, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
