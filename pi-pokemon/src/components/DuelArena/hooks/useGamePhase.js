import { useState, useCallback } from 'react';

// Constantes estrictas para evitar typos
export const GAME_PHASES = {
    DRAW_PHASE: 'DRAW_PHASE',     // Robar carta inicio de turno (preparación)
    MAIN_PHASE: 'MAIN_PHASE',     // Bajar a banca, mover a activa (D&D permitido)
    BATTLE_PHASE: 'BATTLE_PHASE', // D&D bloqueado. Seleccionar ataque.
    END_PHASE: 'END_PHASE',       // Resolver efectos de final de turno
};

export const PLAYERS = {
    PLAYER: 'PLAYER',
    OPPONENT: 'OPPONENT'
};

export const useGamePhase = (initialPlayer = PLAYERS.PLAYER) => {
    const [currentPhase, setCurrentPhase] = useState(GAME_PHASES.MAIN_PHASE);
    const [turnPlayer, setTurnPlayer] = useState(initialPlayer);
    const [isFsmPaused, setIsFsmPaused] = useState(false); // Para detener mecánicas durante animaciones mortales

    // Controles de Pausa para la Parca
    const pauseFSM = useCallback(() => setIsFsmPaused(true), []);
    const resumeFSM = useCallback(() => setIsFsmPaused(false), []);

    // Lógica de avance seguro de fases
    const advancePhase = useCallback(({ playerActive, opponentActive }) => {
        if (isFsmPaused) {
            console.warn("FSM Bloqueada: Resolviendo ciclo de muerte.");
            return;
        }

        setCurrentPhase((prevPhase) => {
            switch (prevPhase) {
                case GAME_PHASES.DRAW_PHASE:
                    return GAME_PHASES.MAIN_PHASE;
                case GAME_PHASES.MAIN_PHASE:
                    // Regla de Bloqueo: Si 'Active Zone' del jugador del turno está vacío, no se puede avanzar.
                    if (turnPlayer === PLAYERS.PLAYER && !playerActive) {
                        console.warn("FSM Bloqueada: El jugador no tiene Pokémon activo.");
                        return GAME_PHASES.MAIN_PHASE;
                    }
                    if (turnPlayer === PLAYERS.OPPONENT && !opponentActive) {
                        console.warn("FSM Bloqueada: El oponente no tiene Pokémon activo.");
                        return GAME_PHASES.MAIN_PHASE;
                    }
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
    }, [isFsmPaused, turnPlayer]);

    // Función para forzar saltos (ej: cartas de efecto que terminan el turno)
    const forcePhase = useCallback((phase) => {
        if (!isFsmPaused && Object.values(GAME_PHASES).includes(phase)) {
            setCurrentPhase(phase);
        }
    }, [isFsmPaused]);

    // Orquestación estricta de la Secuencia de Ataque
    const ejecutarAtaque = useCallback(async ({
        attacker,
        defender,
        setDefenderDamage,
        setIsAttacking
    }) => {
        // Validación de seguridad para prevenir exploits
        if (isFsmPaused || currentPhase !== GAME_PHASES.BATTLE_PHASE || !attacker || !defender) {
            console.warn("Ataque denegado: Estado del tablero inválido o fase incorrecta.");
            return;
        }

        return new Promise((resolve) => {
            setIsAttacking(true); // Bloque que dispara daño visual CSS/SVG

            setTimeout(() => {
                try {
                    // Cálculo Lógico del Daño (Mínimo 20 por ahora, pero escalable en Módulo 3)
                    const damageDealt = attacker.attackDamage || 20;

                    // Aplica Daño Acumulado al estado React
                    setDefenderDamage(prev => prev + damageDealt);

                    resolve(damageDealt);
                } catch (error) {
                    console.error("Error crítico durante la resolución del ataque:", error);
                    resolve(0);
                } finally {
                    setIsAttacking(false);
                    // M1 Regla estricta: Finaliza agresión = Auto transiciona al Final del Turno
                    forcePhase(GAME_PHASES.END_PHASE);

                    // Nota del FSM: Inmediatamente después de esto, `advancePhase` o un auto-bot tirará a DRAW_PHASE.
                }
            }, 500); // 500ms sincronizado exacto con la duración de <ImpactEffect />
        });
    }, [currentPhase, isFsmPaused, forcePhase]);

    return {
        currentPhase,
        turnPlayer,
        isFsmPaused,
        pauseFSM,
        resumeFSM,
        advancePhase,
        forcePhase,
        ejecutarAtaque,

        // Helpers booleanos útiles para renderizado condicional en la UI
        isPlayerTurn: turnPlayer === PLAYERS.PLAYER,
        isMainPhase: currentPhase === GAME_PHASES.MAIN_PHASE,
        isBattlePhase: currentPhase === GAME_PHASES.BATTLE_PHASE,
        canDragAndDrop: (!isFsmPaused && turnPlayer === PLAYERS.PLAYER && currentPhase === GAME_PHASES.MAIN_PHASE)
    };
};
