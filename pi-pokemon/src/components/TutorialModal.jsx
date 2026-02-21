import React, { useState, useEffect } from "react";
import "./TutorialModal.css";

const TutorialModal = ({ isOpen, onClose }) => {
    const [displayedText, setDisplayedText] = useState("");
    const fullText = `
> CARGANDO DATOS...
> REGLAS DEL TCG INICIADAS:

1. HP & ATAQUE:
Cada Pokémon hereda sus stats de la PokéAPI.
HP dicta la vida en combate. El Daño se 
calcula dividiendo el Stat de Ataque Base.

2. DEBILIDADES (WEAKNESS) Y RESISTENCIAS:
El daño se duplica (x2) al golpear una debilidad.
El daño se reduce (-20) si el rival es resistente.

3. RETREAT COST:
Para cambiar de Pokémon activo, debes descartar
energías incoloras según su coste de retirada.

> FIN DE LA TRANSMISIÓN.
    `;

    useEffect(() => {
        if (isOpen) {
            setDisplayedText("");
            let i = 0;
            const typingInterval = setInterval(() => {
                setDisplayedText(prev => prev + fullText.charAt(i));
                i++;
                if (i >= fullText.length) clearInterval(typingInterval);
            }, 30); // Velocidad tipo "Typewriter"

            return () => clearInterval(typingInterval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="pokedex-overlay">
            <div className="pokedex-modal">
                <div className="pokedex-header">
                    <div className="blue-circle"></div>
                    <div className="red-circle"></div>
                    <div className="yellow-circle"></div>
                    <div className="green-circle"></div>
                </div>

                <div className="pokedex-screen-container">
                    <div className="pokedex-screen">
                        <pre className="typewriter-text">{displayedText}</pre>
                    </div>
                </div>

                <div className="pokedex-controls">
                    <div className="d-pad"></div>
                    <button className="close-btn" onClick={onClose}>CERRAR</button>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;
