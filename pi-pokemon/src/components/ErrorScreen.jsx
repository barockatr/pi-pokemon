import React from 'react';
import useGameStore from '../store/useGameStore';
import './ErrorScreen.css';

const ErrorScreen = () => {
    const globalError = useGameStore(state => state.globalError);
    const errorMessage = useGameStore(state => state.errorMessage);
    const clearGlobalError = useGameStore(state => state.clearGlobalError);

    if (!globalError) return null;

    const handleRetry = () => {
        clearGlobalError();
        // Reloading the page clears the React tree and forces a fresh load of the initial data
        window.location.reload();
    };

    return (
        <div className="error-screen-overlay">
            <div className="error-screen-content">
                <div className="error-icon-container">
                    <span className="error-icon">⚠️</span>
                </div>
                <h1 className="error-title">¡Oh no!</h1>
                <p className="error-message">{errorMessage || "El Centro Pokémon está fuera de servicio. Intenta más tarde."}</p>
                <button className="error-retry-button" onClick={handleRetry}>
                    <span className="retry-icon">🔄</span> Reintentar Conexión
                </button>
            </div>
        </div>
    );
};

export default ErrorScreen;
