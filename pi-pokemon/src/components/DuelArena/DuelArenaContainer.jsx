import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeckStore from '../../store/useDeckStore';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor
} from '@dnd-kit/core';

import { useGamePhase, GAME_PHASES, PLAYERS } from './hooks/useGamePhase';
import DraggableCard from './DraggableCard';
import DroppableZone from './DroppableZone';
import DamageTokenOverlay from './DamageToken';
import ImpactEffect from './effects/ImpactEffect';
import Card from '../Card';

import './DuelArena.css';

const DuelArenaContainer = () => {
    const navigate = useNavigate();
    const { deck } = useDeckStore();

    // Initial Opponent logic (similar to old DuelArena)
    const [opponentCard, setOpponentCard] = useState(null);

    // Board State
    const [playerHand, setPlayerHand] = useState([]);
    const [playerActive, setPlayerActive] = useState(null);
    const [opponentActive, setOpponentActive] = useState(null);

    // Combat State
    const [playerDamage, setPlayerDamage] = useState(0);
    const [opponentDamage, setOpponentDamage] = useState(0);
    const [isAttacking, setIsAttacking] = useState(false);
    const [activeDragId, setActiveDragId] = useState(null);
    const [result, setResult] = useState(null);

    // Configure DND Sensors for robust cross-device drag handling without click delays
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // minimum drag distance before overriding clicks
            }
        })
    );

    // Custom Hook FSM
    const {
        currentPhase,
        turnPlayer,
        advancePhase,
        forcePhase,
        ejecutarAtaque,
        canDragAndDrop,
        isPlayerTurn,
        isMainPhase,
        isBattlePhase
    } = useGamePhase();

    // Al montarse el componente o cambiar el deck, hidratamos la mano
    useEffect(() => {
        if (!deck || deck.length !== 6) {
            navigate('/home'); // Evitar que el usuario entre a la arena con mano vacía o truncada
            return;
        }

        setPlayerHand(deck.map((card, idx) => ({ ...card, currentInstanceId: `hand-${card.id}-${idx}` })));

        // Dummy opponent para testing del Deck Builder (hasta que integremos IA o PvP)
        const dummyOpponent = {
            id: 'dummy-ai-1',
            name: "Dragonite (Gimnasio)",
            hp: 200,
            image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png"
        };

        setOpponentCard(dummyOpponent);
        setOpponentActive({ ...dummyOpponent, currentInstanceId: `opp-${dummyOpponent.id}` });
        setOpponentDamage(0);
        setPlayerDamage(0);
        setResult(null);
    }, [deck]);

    // Cleanup on close
    const handleClose = () => {
        navigate('/home'); // Volver a la Pokédex
    };

    // --- DND Handlers ---
    const handleDragStart = (event) => {
        console.log("🎮 Drag STARTED:", event.active.id, event);
        setActiveDragId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        console.log("🎮 Drag ENDED. Active:", active?.id, "Over:", over?.id);

        setActiveDragId(null);

        // Only allow dropping if Phase is correct and hover is valid
        if (!over || !canDragAndDrop) {
            if (!canDragAndDrop) console.warn("D&D Blocked: Not Main Phase or Not Player Turn");
            if (!over) console.warn("D&D Failed: Dropped outside a valid zone");
            return;
        }

        console.log("✅ Valid Drop Detected over:", over.id);

        // Moving from Hand to Player Active Zone
        if (over.id === 'player-active-zone' && playerHand.find(c => c.currentInstanceId === active.id)) {
            const cardToMove = playerHand.find(c => c.currentInstanceId === active.id);
            console.log("-> Moving to active zone:", cardToMove.name);
            setPlayerHand(prev => prev.filter(c => c.currentInstanceId !== active.id));
            setPlayerActive(cardToMove);
            // Optionally, play a summon sound effect here
        }
    };

    // --- Combat Logic ---
    const handleAttack = async () => {
        if (!isBattlePhase || !playerActive || !opponentActive || isAttacking) return;

        // Delegamos la orquestación estricta al FSM
        const damageDealt = await ejecutarAtaque({
            playerActive,
            opponentActive,
            setOpponentDamage,
            setIsAttacking
        });

        // 5. Post-Resolución: Chequeo de condición de victoria
        if (damageDealt !== undefined) {
            const newTotalDamage = opponentDamage + damageDealt;
            if (newTotalDamage >= (opponentActive.hp || 50)) {
                setResult(`🏆 ¡${playerActive.name.toUpperCase()} GANA!`);
            }
        }
    };

    if (!opponentCard) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="duel-arena-container">
                {/* Top Status Bar (Optional) */}
                {result && (
                    <div className="arena-result" style={{ position: 'absolute', top: '10%', zIndex: 99999, fontSize: '3rem', color: 'gold' }}>
                        {result}
                    </div>
                )}

                {/* The 3D Perspective Board */}
                <div className="playmat-board">
                    {/* OPPONENT HALF */}
                    <div className="half-board opponent">
                        <DroppableZone id="opponent-active-zone" className="zone-container active-zone">
                            <span className="zone-label">Active</span>
                            {opponentActive && (
                                <div className={`card-container ${isAttacking ? 'shake-violent' : ''}`} style={{ position: 'relative' }}>
                                    <ImpactEffect isActive={isAttacking} />
                                    <DamageTokenOverlay totalDamage={opponentDamage} />
                                    <Card {...opponentActive} isArena={true} />
                                </div>
                            )}
                        </DroppableZone>
                        <div className="zone-container bench-zone">
                            <span className="zone-label">Bench</span>
                            {/* Empty for MVP, but scalable */}
                        </div>
                    </div>

                    <div className="playmat-divider"></div>

                    {/* PLAYER HALF */}
                    <div className="half-board player">
                        <DroppableZone id="player-active-zone" className="zone-container active-zone" accept="pokemon">
                            <span className="zone-label">Active</span>
                            {playerActive && (
                                <div className="card-container" style={{ position: 'relative' }}>
                                    <DamageTokenOverlay totalDamage={playerDamage} />
                                    <Card {...playerActive} isArena={true} />
                                </div>
                            )}
                        </DroppableZone>

                        <div className="zone-container bench-zone" style={{ display: 'flex', gap: '10px' }}>
                            <span className="zone-label" style={{ fontSize: '1.2rem', top: '-25px' }}>Hand</span>
                            {playerHand.map((card) => (
                                <DraggableCard
                                    key={card.currentInstanceId}
                                    id={card.currentInstanceId}
                                    pokemon={card}
                                    isDraggable={canDragAndDrop}
                                >
                                    <div className="card-container">
                                        <Card {...card} isArena={true} />
                                    </div>
                                </DraggableCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Overlays during Drag must be OUTSIDE the 3D container to avoid clipping/z-index issues */}
                <DragOverlay dropAnimation={null}>
                    {activeDragId ? (
                        <div className="card-container dragging-clone" style={{
                            transform: 'scale(1.2) rotate(-5deg)',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
                        }}>
                            <Card {...(playerHand.find(c => c.currentInstanceId === activeDragId) || {})} isArena={true} />
                        </div>
                    ) : null}
                </DragOverlay>

                {/* TCG UI OVERLAY */}
                <div className="arena-ui-overlay">
                    <h3 style={{ color: '#fff', margin: '0 0 10px 0', borderBottom: '1px solid #444', paddingBottom: '5px' }}>
                        {currentPhase.replace('_', ' ')}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            className="arena-btn"
                            style={{
                                backgroundColor: isMainPhase && playerActive && opponentActive ? '#7AC74C' : '#333',
                                opacity: isMainPhase && playerActive && opponentActive ? 1 : 0.5
                            }}
                            onClick={() => { if (isMainPhase && playerActive && opponentActive) advancePhase(); }}
                            disabled={!isMainPhase || !playerActive || !opponentActive || result}
                        >
                            {isMainPhase && playerActive && opponentActive ? 'Terminar Fase Principal' : 'Esperando...'}
                        </button>

                        <button
                            className="arena-btn fight-btn"
                            style={{
                                backgroundColor: isBattlePhase ? '#EE8130' : '#333',
                                opacity: isBattlePhase && playerActive && !isAttacking ? 1 : 0.5,
                                transform: isBattlePhase ? 'scale(1.05)' : 'scale(1)'
                            }}
                            onClick={handleAttack}
                            disabled={!isBattlePhase || !playerActive || isAttacking || result}
                        >
                            {isAttacking ? 'ATACANDO...' : '⚔️ DECLARAR ATAQUE'}
                        </button>
                    </div>

                    <button className="arena-btn close-btn" onClick={handleClose} style={{ marginTop: '15px' }}>
                        Huir / Cerrar
                    </button>
                </div>
            </div>
        </DndContext>
    );
};

export default DuelArenaContainer;
