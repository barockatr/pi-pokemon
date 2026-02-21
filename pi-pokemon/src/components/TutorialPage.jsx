import React from "react";
import { Link } from "react-router-dom";
import "./TutorialPage.css";

const TutorialPage = () => {
    return (
        <div className="tutorial-container">
            <div className="tutorial-content">
                <h1>Módulo Pedagógico: Reglas del TCG</h1>

                <section className="tutorial-section">
                    <h2>1. Las Estadísticas Centrales (HP & Attack)</h2>
                    <p>
                        Cada carta representa a un Pokémon y hereda sus estadísticas directamente de la PokéAPI.
                        El valor de **Hearth Points (HP)** es su vida útil en el combate, y el daño de los
                        movimientos se calcula dividiendo su stat de ataque base.
                    </p>
                </section>

                <section className="tutorial-section">
                    <h2>2. Debilidades (Weakness) y Resistencias</h2>
                    <p>
                        Nuestra lógica TCG calcula automáticamente los multiplicadores elementales.
                        Si un Pokémon de Fuego ataca a uno de Planta (debilidad de Planta al Fuego),
                        el daño final se **duplica (x2)** al presionar el motor de combate.
                        Si ataca a uno de Agua, el daño suele **reducirse en -20** debido a la resistencia.
                    </p>
                </section>

                <section className="tutorial-section">
                    <h2>3. Costes de Retirada (Retreat Cost)</h2>
                    <p>
                        Todas las cartas de nuestra Pokédex tienen un Retreat Cost por defecto evaluado en Energías Incoloras (⚪).
                        Estos dictan cuánta energía debes quemar para cambiar de Pokémon activo.
                    </p>
                </section>

                <Link to="/home" className="home-button">
                    Entendido, volver al Dashboard
                </Link>
            </div>
        </div>
    );
};

export default TutorialPage;
