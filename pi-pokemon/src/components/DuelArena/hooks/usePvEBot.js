import { useEffect, useRef } from 'react';
import { GAME_PHASES, PLAYERS } from './useGamePhase';
import useDeckStore from '../../../store/useDeckStore';

/**
 * usePvEBot - "El Ritmo de la Máquina" (Módulo 4)
 * Ejecuta acciones secuenciales milimétricas durante el turno del Oponente.
 */
export const usePvEBot = ({
    fsm,
    boardState
}) => {
    const {
        currentPhase,
        turnPlayer,
        isFsmPaused,
        forcePhase,
        passTurn,
        ejecutarAtaque
    } = fsm;

    const {
        opponentActive,
        setOpponentActive,
        playerActive,
        setPlayerDamage,
        setIsAttacking,
    } = boardState;

    const { opponentHand, setOpponentHand } = useDeckStore();

    // Usamos refs para evitar que cierres asíncronos lean estado viejo
    const stateRef = useRef({ opponentActive, playerActive, opponentHand, isFsmPaused, turnPlayer });

    useEffect(() => {
        stateRef.current = { opponentActive, playerActive, opponentHand, isFsmPaused, turnPlayer };
    }, [opponentActive, playerActive, opponentHand, isFsmPaused, turnPlayer]);

    useEffect(() => {
        console.log(`🤖 [BOT Observer] Evaluando turno... turnPlayer: ${turnPlayer}, isFsmPaused: ${isFsmPaused}`);

        // Solo actuar si es turno del oponente y no hay pausa
        if (turnPlayer !== PLAYERS.OPPONENT || isFsmPaused) return;

        let isCancelled = false;

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const runBotTurn = async () => {
            console.log("🤖 [BOT] Iniciando rutina...");

            // FASE 1: INVOCAR (si la zona está vacía)
            let currentActive = stateRef.current.opponentActive;

            if (!currentActive) {
                console.log("🤖 [BOT] Zona activa vacía. Preparando invocación...");
                await delay(1000); // Tensión
                if (isCancelled || stateRef.current.isFsmPaused) return;

                const hand = [...stateRef.current.opponentHand];
                if (hand.length > 0) {
                    const nextPokemon = hand.shift(); // Saca el primero de la mano
                    console.log(`🤖 [BOT] Invocando a ${nextPokemon.name}`);
                    setOpponentHand(hand);
                    setOpponentActive(nextPokemon);
                    currentActive = nextPokemon; // Actualizar variable local
                } else {
                    console.log("🤖 [BOT] ¡Mazo vacío! No puedo hacer nada.");
                    // Módulo de derrota iría aquí
                }
            }

            // FASE 2: PRE-ATAQUE (Thinking)
            await delay(1200);
            if (isCancelled || stateRef.current.isFsmPaused) return;

            // FASE 3: ATACAR
            const target = stateRef.current.playerActive;

            if (currentActive && target) {
                const baseDamage = currentActive.attackDamage || currentActive.attack || 40;

                // Módulo 3.5: AI Random Attack Selector
                // 70% de usar ataque fuerte (baseDamage), 30% ataque rápido (baseDamage/2)
                const isHeavyAttack = Math.random() > 0.3;
                const finalDamage = isHeavyAttack ? baseDamage : Math.round(baseDamage / 2);
                const moveName = isHeavyAttack
                    ? (currentActive.moves?.[1] || "Slam")
                    : (currentActive.moves?.[0] || "Quick Attack");

                console.log(`🤖 [BOT] ${currentActive.name} usará ${moveName} por ${finalDamage} DMG!`);

                const striker = { ...currentActive, attackDamage: finalDamage };

                await ejecutarAtaque({
                    attacker: striker,
                    defender: target,
                    setDefenderDamage: setPlayerDamage,
                    setIsAttacking
                });
            } else if (!target) {
                console.log("🤖 [BOT] No hay objetivo válido al que atacar.");
            }

            // FASE 4: TERMINAR TURNO
            await delay(1200); // Tiempo post-animación
            if (isCancelled || stateRef.current.isFsmPaused) return;

            console.log("🤖 [BOT] Turno finalizado.");
            passTurn();
        };

        runBotTurn();

        return () => {
            isCancelled = true;
        };

    }, [turnPlayer, isFsmPaused]); // Solo reactivarse si cambia el turno o la pausa
};
