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
        opponentBench,
        setOpponentBench
    } = boardState;

    const { opponentHand, setOpponentHand } = useDeckStore();

    // Usamos refs para evitar que cierres asíncronos lean estado viejo
    const stateRef = useRef({ opponentActive, playerActive, opponentHand, opponentBench, isFsmPaused, turnPlayer });

    useEffect(() => {
        stateRef.current = { opponentActive, playerActive, opponentHand, opponentBench, isFsmPaused, turnPlayer };
    }, [opponentActive, playerActive, opponentHand, opponentBench, isFsmPaused, turnPlayer]);

    useEffect(() => {

        // Solo actuar si es turno del oponente y no hay pausa
        if (turnPlayer !== PLAYERS.OPPONENT || isFsmPaused) return;

        let isCancelled = false;

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const runBotTurn = async () => {

            // FASE 1: INVOCAR (Reemplazo Táctico - Módulo 1)
            let currentActive = stateRef.current.opponentActive;

            if (!currentActive) {
                await delay(1000); // Tensión
                if (isCancelled || stateRef.current.isFsmPaused) return;

                const hand = [...stateRef.current.opponentHand];
                const bench = [...stateRef.current.opponentBench];

                if (hand.length > 0) {
                    // Prioridad 1: Jugar desde la Mano
                    const nextPokemon = hand.shift();
                    setOpponentHand(hand);
                    setOpponentActive(nextPokemon);
                    currentActive = nextPokemon;
                } else if (bench.length > 0) {
                    // Prioridad 2: Jugar desde la Banca si la Mano está vacía
                    const nextPokemon = bench.shift();
                    setOpponentBench(bench);
                    setOpponentActive(nextPokemon);
                    currentActive = nextPokemon;
                } else {
                    // Módulo de victoria letal se maneja en el Observer de DuelArenaContainer
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

                const striker = { ...currentActive, attackDamage: finalDamage };

                await ejecutarAtaque({
                    attacker: striker,
                    defender: target,
                    setDefenderDamage: setPlayerDamage,
                    setIsAttacking
                });
            } else if (!target) {
            }

            // FASE 4: TERMINAR TURNO
            await delay(1200); // Tiempo post-animación
            if (isCancelled || stateRef.current.isFsmPaused) return;

            passTurn();
        };

        runBotTurn();

        return () => {
            isCancelled = true;
        };

    }, [turnPlayer, isFsmPaused]); // Solo reactivarse si cambia el turno o la pausa
};
