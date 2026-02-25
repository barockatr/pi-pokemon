import { useState, useCallback } from 'react';

// Constantes estrictas para evitar typos
export const GAME_PHASES = {
    DRAW_PHASE: 'DRAW_PHASE',     // Robar carta inicio de turno (opcional por ahora, prepara terreno)
    MAIN_PHASE: 'MAIN_PHASE',     // Bajar a banca, mover a activa (D&D permitido)
    BATTLE_PHASE: 'BATTLE_PHASE', // D&D bloqueado. Seleccionar ataque.
    END_PHASE: 'END_PHASE',       // Resolver venenos/quemaduras, pasar turno
};

export const PLAYERS = {
    PLAYER: 'PLAYER',
    OPPONENT: 'OPPONENT'
};

export const useGamePhase = (initialPlayer = PLAYERS.PLAYER) => {
    const [currentPhase, setCurrentPhase] = useState(GAME_PHASES.MAIN_PHASE);
    const [turnPlayer, setTurnPlayer] = useState(initialPlayer);

    // Lógica de avance seguro de fases
    const advancePhase = useCallback(() => {
        setCurrentPhase((prevPhase) => {
            switch (prevPhase) {
                case GAME_PHASES.DRAW_PHASE:
                    return GAME_PHASES.MAIN_PHASE;
                case GAME_PHASES.MAIN_PHASE:
                    return GAME_PHASES.BATTLE_PHASE;
                case GAME_PHASES.BATTLE_PHASE:
                    return GAME_PHASES.END_PHASE;
                case GAME_PHASES.END_PHASE:
                    // Cambio de turno automático
                    setTurnPlayer(prevPlayer =>
                        prevPlayer === PLAYERS.PLAYER ? PLAYERS.OPPONENT : PLAYERS.PLAYER
                    );
                    return GAME_PHASES.DRAW_PHASE;
                default:
                    return GAME_PHASES.MAIN_PHASE;
            }
        });
    }, []);

    // Función para forzar saltos (ej: cartas de efecto que terminan el turno)
    const forcePhase = useCallback((phase) => {
        if (Object.values(GAME_PHASES).includes(phase)) {
            setCurrentPhase(phase);
        }
    }, []);

    // Operación 2: Orquestación estricta de la Secuencia de Ataque
    const ejecutarAtaque = useCallback(async ({
        playerActive,
        opponentActive,
        setOpponentDamage,
        setIsAttacking
    }) => {
        // Validación de seguridad para prevenir exploits
        if (currentPhase !== GAME_PHASES.BATTLE_PHASE || !playerActive || !opponentActive) {
            console.warn("Ataque denegado: Fase incorrecta o faltan Pokémon activos.");
            return;
        }

        return new Promise((resolve) => {
            // 1. Trigger de Animación Visual (UI: SVG de impacto y temblor)
            setIsAttacking(true);

            setTimeout(() => {
                try {
                    // 2. Cálculo Lógico del Daño (aislado de la UI temporal)
                    const damageDealt = playerActive.attackDamage || 20;

                    // 3. Modificación del Estado del Tablero (Activa el DamageToken Overlay)
                    setOpponentDamage(prev => prev + damageDealt);

                    resolve(damageDealt);
                } catch (error) {
                    console.error("Error crítico durante la resolución del ataque:", error);
                    resolve(0); // Resolvemos con 0 para que la Promesa no quede colgada
                } finally {
                    // 4. Transición Segura de la Máquina de Estados al terminar
                    setIsAttacking(false);
                    forcePhase(GAME_PHASES.END_PHASE);
                }
            }, 500); // 500ms sincronizado exacto con la duración de <ImpactEffect />
        });
    }, [currentPhase, forcePhase]);

    return {
        currentPhase,
        turnPlayer,
        advancePhase,
        forcePhase,
        ejecutarAtaque, // Exportamos la nueva función orquestadora
        // Helpers booleanos útiles para renderizado condicional en la UI
        isPlayerTurn: turnPlayer === PLAYERS.PLAYER,
        isMainPhase: currentPhase === GAME_PHASES.MAIN_PHASE,
        isBattlePhase: currentPhase === GAME_PHASES.BATTLE_PHASE,
        canDragAndDrop: (turnPlayer === PLAYERS.PLAYER && currentPhase === GAME_PHASES.MAIN_PHASE)
    };
};
