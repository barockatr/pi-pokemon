import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDeckStore from '../../store/useDeckStore';

import { useGamePhase, GAME_PHASES, PLAYERS } from './hooks/useGamePhase';
import { usePvEBot } from './hooks/usePvEBot';

import DamageTokenOverlay from './DamageToken';
import ImpactEffect from './effects/ImpactEffect';
import Card from '../Card';
import CardContextMenu from './CardContextMenu';
import CardDetailModal from '../CardDetailModal'; // Holographic modal
import ArenaSkeleton from './ArenaSkeleton'; // UX Suave (Módulo 2)
import { useGameAudio } from './hooks/useGameAudio'; // Módulo 3: Audio

import './DuelArena.css';

const DuelArenaContainer = () => {
    const navigate = useNavigate();
    const { deck, opponentHand, isInitializing, generarMazoBot } = useDeckStore();
    const { playBGM, stopBGM, playSFX } = useGameAudio(); // Instancia de Audio

    // Context Menu State
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedInfoCard, setSelectedInfoCard] = useState(null);

    // Board State
    const [playerHand, setPlayerHand] = useState([]);
    const [playerBench, setPlayerBench] = useState([]);
    const [playerActive, setPlayerActive] = useState(null);
    const [opponentActive, setOpponentActive] = useState(null);

    // Combat & Graveyard State
    const [playerDamage, setPlayerDamage] = useState(0);
    const [opponentDamage, setOpponentDamage] = useState(0);
    const [isAttacking, setIsAttacking] = useState(false);
    const [result, setResult] = useState(null);
    const [gameOver, setGameOver] = useState(null); // 'VICTORY' or 'DEFEAT'
    const [hasGameStarted, setHasGameStarted] = useState(false); // Evita derrota instántanea al inicio
    const [playerGraveyard, setPlayerGraveyard] = useState([]);
    const [opponentGraveyard, setOpponentGraveyard] = useState([]);
    const [dyingCard, setDyingCard] = useState({ player: false, opponent: false });
    const [isCriticalHit, setIsCriticalHit] = useState(false); // Mod 3: Screen shake

    // Bot State (Módulo 3)
    const [opponentBench, setOpponentBench] = useState([]);

    // Custom Hook FSM
    const {
        currentPhase,
        turnPlayer,
        advancePhase,
        forcePhase,
        passTurn,
        ejecutarAtaque,
        canDragAndDrop: isActionPhase, // Renombrado lógicamente ya que no hay DND
        isPlayerTurn,
        isMainPhase,
        isBattlePhase,
        isFsmPaused,
        pauseFSM,
        resumeFSM
    } = useGamePhase();

    // Al montarse el componente o cambiar el deck, hidratamos la mano
    useEffect(() => {
        if (!deck || deck.length !== 6) {
            navigate('/home');
            return;
        }

        setPlayerHand(deck.map((card, idx) => ({ ...card, currentInstanceId: `hand-${card.id}-${idx}` })));

        // Limpiar al rival
        setOpponentActive(null);

        // Módulo 2: Inicializar el Mazo aleatorio del Bot desde la BD (6 Cartas)
        generarMazoBot();

        // Limpiar el estado de banca del rival al iniciar
        setOpponentBench([]);

        setOpponentDamage(0);
        setPlayerDamage(0);
        setResult(null);
        setGameOver(null);
        setHasGameStarted(false);
    }, [deck, navigate]);

    // Inyectar el primer Pokémon del Bot a la zona activa tras cargar el mazo
    useEffect(() => {
        if (!isInitializing && opponentHand.length === 6 && !opponentActive) {
            const initialHand = [...opponentHand];
            const firstStriker = initialHand.shift();
            setOpponentActive(firstStriker);
            useDeckStore.setState({ opponentHand: initialHand });
        }
    }, [isInitializing, opponentHand, opponentActive]);

    // --- Módulo 3: El Cerebro de Nuez ---
    usePvEBot({
        fsm: { currentPhase, turnPlayer, isFsmPaused, advancePhase, ejecutarAtaque, forcePhase, passTurn },
        boardState: {
            opponentActive,
            setOpponentActive,
            playerActive,
            setPlayerDamage,
            setIsAttacking,
            opponentBench,
            setOpponentBench
        }
    });

    const handleClose = () => {
        navigate('/home');
    };

    // --- Módulo 2: Interrupción Holográfica (FSM Pause) ---
    useEffect(() => {
        if (selectedInfoCard) {
            pauseFSM();
        } else {
            // Al cerrar el modal, solo reanudamos si no estamos procesando una muerte o Game Over
            if (!gameOver && !dyingCard.opponent && !dyingCard.player) {
                resumeFSM();
            }
        }
    }, [selectedInfoCard, pauseFSM, resumeFSM, gameOver, dyingCard]);

    // --- Módulo 3: La Parca (Ciclo de Vida) ---
    useEffect(() => {
        if (opponentActive && opponentDamage >= (opponentActive.hp || 50)) {
            resolveDeath(PLAYERS.OPPONENT, opponentActive);
        }
        if (playerActive && playerDamage >= (playerActive.hp || 50)) {
            resolveDeath(PLAYERS.PLAYER, playerActive);
        }
    }, [opponentActive, opponentDamage, playerActive, playerDamage]);

    const resolveDeath = (targetPlayer, card) => {
        pauseFSM();
        setDyingCard(prev => ({ ...prev, [targetPlayer === PLAYERS.OPPONENT ? 'opponent' : 'player']: true }));

        // Módulo 3: El "Juice" Visual - Activar Screen Shake global por golpe letal
        setIsCriticalHit(true);
        setTimeout(() => setIsCriticalHit(false), 500);

        setTimeout(() => {
            if (targetPlayer === PLAYERS.OPPONENT) {
                setOpponentGraveyard(prev => [...prev, card]);
                setOpponentActive(null);
                setOpponentDamage(0);
                setDyingCard(prev => ({ ...prev, opponent: false }));
            } else {
                setPlayerGraveyard(prev => [...prev, card]);
                setPlayerActive(null);
                setPlayerDamage(0);
                setDyingCard(prev => ({ ...prev, player: false }));
            }
            if (!selectedInfoCard) {
                resumeFSM();
            }
        }, 1150); // Módulo 1: Sincronizado con la duración de la animación implosion en CSS (1.2s avg)
    };

    // --- Módulo 4: Game Over Observer ---
    useEffect(() => {
        if (isFsmPaused || gameOver || !hasGameStarted) return;

        // Player Lose Condition: Active vacío Y Bench vacío Y Mano vacía
        if (!playerActive && playerBench.length === 0 && playerHand.length === 0 && deck.length > 0) {
            setGameOver('DEFEAT');
            setResult('☠️ ¡HAS SIDO DERROTADO!');
            pauseFSM();
        }

        // Opponent Lose Condition (Módulo 1): Active vacío Y Banca vacía Y Mano vacía
        if (!opponentActive && opponentBench.length === 0 && opponentHand.length === 0 && !isInitializing) {
            setGameOver('VICTORY');
            setResult('🏆 ¡VICTORIA APLASTANTE!');
            pauseFSM();
        }
    }, [isFsmPaused, playerActive, playerBench.length, playerHand.length, opponentActive, opponentBench.length, opponentHand.length, gameOver, hasGameStarted, deck.length, isInitializing]);

    // --- Context Menu Triggers ---
    const handleCardClick = (e, card, locationType) => {
        e.stopPropagation(); // Evitar cerrar inmediatamente si se hace clic dentro

        // Módulo 3: No abrir menús si no es tu turno o estamos en animación.
        // Además, la fase de Action es cualquiera mientras sea Play Phase,
        // pero vamos a flexibilizar si locationType === 'ACTIVE'.
        if (turnPlayer !== PLAYERS.PLAYER || isFsmPaused) return;

        // Calcular si las acciones están permitidas
        const canMoveToBench = locationType === 'HAND' && playerBench.length < 5;

        setActiveMenu({
            card,
            type: locationType,
            position: { x: e.clientX, y: e.clientY },
            canMoveToBench,
            isPlayerActiveEmpty: !playerActive
        });
    };

    const closeMenu = () => setActiveMenu(null);

    // --- Context Menu Actions ---
    const handlePlayToBench = (card) => {
        setPlayerHand(prev => prev.filter(c => c.currentInstanceId !== card.currentInstanceId));
        setPlayerBench(prev => [...prev, card]);
        setHasGameStarted(true); // Arranca el motor
        closeMenu();
    };

    const handleMoveToActive = (card) => {
        // If it comes from hand, remove from hand, else from bench
        if (activeMenu?.type === 'HAND') {
            setPlayerHand(prev => prev.filter(c => c.currentInstanceId !== card.currentInstanceId));
            setHasGameStarted(true);
        } else {
            setPlayerBench(prev => prev.filter(c => c.currentInstanceId !== card.currentInstanceId));
        }
        setPlayerActive(card);
        closeMenu();
    };

    const handleViewInfo = (card) => {
        setSelectedInfoCard(card);
        closeMenu();
    };

    // --- Módulo 3: RPG Combat Logic ---
    const handleRpgAttack = async (damageAmount, moveName) => {
        // Cierra el menú táctico
        closeMenu();

        if (!playerActive || !opponentActive || isAttacking || isFsmPaused) return;

        console.log(`⚔️ Jugador usa ${moveName} infligiendo ${damageAmount} de daño!`);

        // Sobrescribimos temporalmente el attackDamage de la carta activa para este golpe particular
        const striker = { ...playerActive, attackDamage: damageAmount };

        await ejecutarAtaque({
            attacker: striker,
            defender: opponentActive,
            setDefenderDamage: setOpponentDamage,
            setIsAttacking
        });

        // El turno del jugador finaliza tras un ataque exitoso (RPG rule)
        // Damos un breve delay para que termine la animación
        setTimeout(() => {
            passTurn();
        }, 1200);
    };

    // Early return para Módulo 2
    if (isInitializing) return <ArenaSkeleton />;

    return (
        <div className="duel-arena-container tactical-mode" onClick={closeMenu}>
            {/* Modal Global: Game Over */}
            {gameOver && (
                <div className="game-over-modal-overlay">
                    <div className={`game-over-modal ${gameOver === 'VICTORY' ? 'victory' : 'defeat'}`}>
                        <h1>{gameOver === 'VICTORY' ? '🏆 VICTORIA' : '☠️ DERROTA'}</h1>
                        <p>{result}</p>
                        <button className="arena-btn" onClick={handleClose} style={{ marginTop: '20px', padding: '15px 30px', fontSize: '1.2rem' }}>
                            Volver al Dashboard (Home)
                        </button>
                    </div>
                </div>
            )}

            {/* Float Escape Button */}
            <button className="escape-btn-floating" onClick={handleClose}>
                ❌ Abandonar
            </button>

            {/* Modal Global: Info */}
            <CardDetailModal pokemon={selectedInfoCard} onClose={() => setSelectedInfoCard(null)} />

            {/* --- MÓDULO 1: El Divorcio Visual --- */}

            {/* AREA 1: 3D ARENA VIEWPORT (Top 75%) */}
            <div className={`arena-viewport ${isCriticalHit ? 'global-screen-shake' : ''}`}>
                <div className="playmat-board">
                    {/* OPPONENT HALF */}
                    <div className="half-board opponent">
                        <div className="zone-container graveyard-zone">
                            <div className="graveyard-card" style={{ opacity: opponentGraveyard.length > 0 ? 1 : 0.1 }}>
                                {opponentGraveyard.length > 0 ? (
                                    <div className="card-back-graveyard" title="Cementerio">🪦 {opponentGraveyard.length}</div>
                                ) : (
                                    <div className="card-back-graveyard empty" />
                                )}
                            </div>
                        </div>

                        <div className="zone-container active-zone">
                            <span className="zone-label">Active</span>
                            {opponentActive && (
                                <div className={`card-container ${isAttacking ? 'shake-violent' : ''} ${dyingCard.opponent ? 'card-explosion' : ''}`} style={{ position: 'relative' }}>
                                    <ImpactEffect isActive={isAttacking} />
                                    <DamageTokenOverlay totalDamage={opponentDamage} />
                                    <Card {...opponentActive} isArena={true} />
                                </div>
                            )}
                        </div>
                        <div className="zone-container bench-zone">
                            <span className="zone-label">Bench (Bot)</span>
                            {opponentBench.map((c, idx) => (
                                <div key={idx} style={{ width: '40px', height: '60px', backgroundColor: '#204abb', border: '2px solid #bba32e', borderRadius: '4px', margin: '0 2px' }} />
                            ))}
                        </div>
                    </div>

                    <div className="playmat-divider"></div>

                    {/* PLAYER HALF */}
                    <div className="half-board player">
                        <div className="zone-container graveyard-zone">
                            <div className="graveyard-card" style={{ opacity: playerGraveyard.length > 0 ? 1 : 0.1 }}>
                                {playerGraveyard.length > 0 ? (
                                    <div className="card-back-graveyard" title="Cementerio">🪦 {playerGraveyard.length}</div>
                                ) : (
                                    <div className="card-back-graveyard empty" />
                                )}
                            </div>
                        </div>

                        <div className="zone-container active-zone">
                            <span className="zone-label">Active</span>
                            {playerActive && (
                                <div
                                    className={`card-container interactive-card ${dyingCard.player ? 'card-explosion' : ''}`}
                                    style={{ position: 'relative' }}
                                    onClick={(e) => handleCardClick(e, playerActive, 'ACTIVE')}
                                >
                                    <DamageTokenOverlay totalDamage={playerDamage} />
                                    <Card {...playerActive} isArena={true} />
                                </div>
                            )}
                        </div>

                        <div className="zone-container bench-zone">
                            <span className="zone-label">Bench</span>
                            <div className="bench-cards-wrapper">
                                {playerBench.map((card) => (
                                    <div
                                        key={card.currentInstanceId}
                                        className="card-container interactive-card"
                                        onClick={(e) => handleCardClick(e, card, 'BENCH')}
                                    >
                                        <Card {...card} isArena={true} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* INDICADOR DE TURNO (HUD Flotante Fase 1) */}
            <div className={`turn-indicator ${turnPlayer === PLAYERS.PLAYER ? 'player-turn' : 'opponent-turn'}`}>
                {turnPlayer === PLAYERS.PLAYER ? '🟢 Tu Turno' : '🔴 Turno Rival'}
            </div>

            {/* BOTÓN TERMINAR TURNO (HUD Flotante Fase 1) */}
            <button
                className={`end-turn-btn ${turnPlayer === PLAYERS.PLAYER ? '' : 'hidden-btn'}`}
                style={{ opacity: turnPlayer === PLAYERS.PLAYER ? 1 : 0, pointerEvents: turnPlayer === PLAYERS.PLAYER ? 'auto' : 'none' }}
                onClick={() => {
                    console.log("Cambiando turno a OPPONENT");
                    passTurn();
                }}
                disabled={isFsmPaused || turnPlayer !== PLAYERS.PLAYER}
            >
                Terminar Turno
            </button>

            {/* AREA 2: 2D PLAYER DOCK (Bottom 25%) */}
            <div className="player-dock-2d">
                <div className="hand-cards-container">
                    {playerHand.map((card, index) => {
                        // Módulo 2: Type Colors for Neon Shadow
                        const primaryTypeObj = card.types?.[0] || card.type;
                        const pType = primaryTypeObj?.name || primaryTypeObj || 'normal';

                        return (
                            <div key={card.currentInstanceId} className="staggered-entrance" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div
                                    className="dock-card-wrapper interactive-card tactical-hover"
                                    style={{
                                        '--card-glow': `var(--type-${pType}, #bba32e)`
                                    }}
                                    onClick={(e) => handleCardClick(e, card, 'HAND')}
                                >
                                    <div className="tactical-glow-layer">
                                        <Card {...card} isArena={true} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {playerHand.length === 0 && (
                        <div className="empty-hand-text">Sin cartas en la mano</div>
                    )}
                </div>
            </div>

            {/* Context Menu Render Portal */}
            {activeMenu && (
                <CardContextMenu
                    card={activeMenu.card}
                    position={activeMenu.position}
                    contextArgs={{
                        type: activeMenu.type,
                        canMoveToBench: activeMenu.canMoveToBench,
                        isPlayerActiveEmpty: activeMenu.isPlayerActiveEmpty
                    }}
                    actions={{
                        onPlayToBench: handlePlayToBench,
                        onMoveToActive: handleMoveToActive,
                        onViewInfo: handleViewInfo,
                        onAttack: handleRpgAttack,
                        onClose: closeMenu
                    }}
                />
            )}
        </div>
    );
};

export default DuelArenaContainer;
