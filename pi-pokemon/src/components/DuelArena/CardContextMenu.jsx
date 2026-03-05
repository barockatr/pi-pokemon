import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './CardContextMenu.css';

/**
 * CardContextMenu - Popover Táctico Contextual (Módulo 2)
 * Renderizado vía React Portals para evitar ser ocultado por paddings/overflows
 * de contenedors 3D o barras de HUD 2D.
 */
const CardContextMenu = ({
    card,
    position,
    contextArgs, // { type: 'HAND' | 'BENCH' | 'ACTIVE', canMoveToBench: bool, isPlayerActiveEmpty: bool }
    actions,     // { onPlayToBench, onMoveToActive, onViewInfo, onClose, onAttack }
}) => {
    const menuRef = useRef(null);

    // Click outside to close (Regla Estricta: Solo 1 menú a la vez)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                actions.onClose();
            }
        };

        // Tiempo de espera para evitar que el mismo click que abre el menú, lo cierre mágicamente.
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [actions]);

    // FIX: useLayoutEffect → clamping ANTES del primer paint (sin flickering)
    // Se ejecuta síncronamente después del DOM update pero ANTES del paint.
    useLayoutEffect(() => {
        if (!menuRef.current) return;
        const rect = menuRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let newLeft = parseFloat(menuRef.current.style.left) || position.x;
        let newTop = parseFloat(menuRef.current.style.top) || position.y;

        // Si el menú se sale por la derecha → abrirlo a la IZQUIERDA del cursor
        if (rect.right > vw - 10) newLeft = position.x - rect.width - 10;
        // Si se sale por abajo → abrirlo ENCIMA del cursor
        if (rect.bottom > vh - 10) newTop = position.y - rect.height - 10;
        // Límites: nunca salir por la izquierda ni por arriba
        if (newLeft < 10) newLeft = 10;
        if (newTop < 10) newTop = 10;

        menuRef.current.style.left = `${newLeft}px`;
        menuRef.current.style.top = `${newTop}px`;
    }, [position]);

    // Posición inicial inteligente:
    // Si el click está en el 60% derecho → abrimos a la izquierda del cursor desde el inicio.
    const MENU_W = 215;
    const MENU_H = 190;
    const isNearRight = position.x > window.innerWidth * 0.6;
    const isNearBottom = position.y > window.innerHeight * 0.6;

    const style = {
        top: isNearBottom ? `${position.y - MENU_H}px` : `${position.y}px`,
        left: isNearRight ? `${position.x - MENU_W}px` : `${position.x}px`,
    };

    const cardArgsActiveFilled = !contextArgs.isPlayerActiveEmpty;

    const renderButtons = () => {
        if (contextArgs.type === 'HAND') {
            return (
                <>
                    {!cardArgsActiveFilled ? (
                        <button
                            className={`context-btn action-btn ${!contextArgs.canMoveToBench ? 'disabled' : ''}`}
                            onClick={() => { if (contextArgs.canMoveToBench) actions.onMoveToActive(card); }}
                            disabled={!contextArgs.canMoveToBench}
                        >
                            🚀 Jugar a Activo
                        </button>
                    ) : (
                        <button
                            className={`context-btn action-btn ${!contextArgs.canMoveToBench ? 'disabled' : ''}`}
                            onClick={() => { if (contextArgs.canMoveToBench) actions.onPlayToBench(card); }}
                            disabled={!contextArgs.canMoveToBench}
                        >
                            ⚔️ Jugar a la Banca
                        </button>
                    )}
                    <button className="context-btn info-btn" onClick={() => actions.onViewInfo(card)}>
                        🔍 Ver Info
                    </button>
                </>
            );
        } else if (contextArgs.type === 'BENCH') {
            if (!cardArgsActiveFilled) {
                return (
                    <>
                        <button
                            className="context-btn action-btn"
                            onClick={() => actions.onMoveToActive(card)}
                        >
                            🚀 Mover a Activo
                        </button>
                        <button className="context-btn info-btn" onClick={() => actions.onViewInfo(card)}>
                            🔍 Ver Info
                        </button>
                    </>
                );
            }
            return (
                <button className="context-btn info-btn" onClick={() => actions.onViewInfo(card)}>
                    🔍 Ver Info
                </button>
            );
        } else if (contextArgs.type === 'ACTIVE') {
            // Ataques REALES de la carta TCG (card.attacks[])
            const realAttacks = card.attacks || [];
            const baseFallbackDmg = card.attackDamage || card.attack || 40;

            if (realAttacks.length > 0) {
                return (
                    <div className="rpg-attacks-container">
                        {realAttacks.map((atk, idx) => {
                            const parsedDmg = parseInt(atk.damage, 10) || Math.round(baseFallbackDmg / (idx === 0 ? 2 : 1));
                            const icon = idx === 0 ? '🗡️' : '💥';
                            const cls = idx === 0 ? 'context-btn attack-btn' : 'context-btn attack-btn ultimate-btn';
                            return (
                                <button
                                    key={idx}
                                    className={cls}
                                    onClick={() => actions.onAttack(parsedDmg, atk.name)}
                                >
                                    {icon} {atk.name} <span className="dmg-badge">({parsedDmg} DMG)</span>
                                </button>
                            );
                        })}
                        <button className="context-btn info-btn" onClick={() => actions.onViewInfo(card)} style={{ marginTop: '6px' }}>
                            🔍 Ver Info de la Carta
                        </button>
                    </div>
                );
            }

            // Fallback genérico
            return (
                <div className="rpg-attacks-container">
                    <button
                        className="context-btn attack-btn"
                        onClick={() => actions.onAttack(Math.round(baseFallbackDmg / 2), 'Tackle')}
                    >
                        🗡️ Tackle <span className="dmg-badge">({Math.round(baseFallbackDmg / 2)} DMG)</span>
                    </button>
                    <button
                        className="context-btn attack-btn ultimate-btn"
                        onClick={() => actions.onAttack(baseFallbackDmg, 'Quick Attack')}
                    >
                        💥 Quick Attack <span className="dmg-badge">({baseFallbackDmg} DMG)</span>
                    </button>
                    <button className="context-btn info-btn" onClick={() => actions.onViewInfo(card)} style={{ marginTop: '10px' }}>
                        🔍 Ver Info de la Carta
                    </button>
                </div>
            );
        }
        return null;
    };

    return createPortal(
        <div className="card-context-menu" style={style} ref={menuRef}>
            <div className="context-menu-header">
                {card.name}
            </div>
            <div className="context-menu-actions">
                {renderButtons()}
            </div>
        </div>,
        document.body
    );
};

export default CardContextMenu;
