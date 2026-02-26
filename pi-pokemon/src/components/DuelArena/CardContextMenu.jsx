import React, { useEffect, useRef } from 'react';
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
            document.addEventListener('touchstart', handleClickOutside); // Soporte móvil
        }, 10);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [actions]);

    // Prevención de rebase del Viewport
    const style = {
        top: `${position.y}px`,
        left: `${position.x}px`,
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
                            disabled={!contextArgs.canMoveToBench} // We use the bench condition because if the hand is empty it shouldn't show anyway
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
                            className={`context-btn action-btn`}
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
            // If active is filled, only show info.
            return (
                <button className="context-btn info-btn" onClick={() => actions.onViewInfo(card)}>
                    🔍 Ver Info
                </button>
            );
        } else if (contextArgs.type === 'ACTIVE') {
            // Módulo 3: Menú Táctico RPG
            // Buscar 'moves' definidos o generar placeholders basados en el 'attackDamage' base
            const baseDamage = card.attackDamage || card.attack || 40;
            const move1 = card.moves?.[0] || 'Tackle';
            const move2 = card.moves?.[1] || 'Quick Attack';

            return (
                <div className="rpg-attacks-container">
                    <button
                        className="context-btn attack-btn"
                        onClick={() => actions.onAttack(Math.round(baseDamage / 2), move1)}
                    >
                        🗡️ {move1} <span className="dmg-badge">({Math.round(baseDamage / 2)} DMG)</span>
                    </button>
                    <button
                        className="context-btn attack-btn ultimate-btn"
                        onClick={() => actions.onAttack(baseDamage, move2)}
                    >
                        💥 {move2} <span className="dmg-badge">({baseDamage} DMG)</span>
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
        document.body // Inyectar directamente al body para sobrevolar TODOS los contenedores (Módulo 2 rule)
    );
};

export default CardContextMenu;
