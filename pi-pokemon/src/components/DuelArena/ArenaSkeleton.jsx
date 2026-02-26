import React from 'react';
import './DuelArena.css';

/**
 * ArenaSkeleton - UX Suave (Módulo 2)
 * Se renderiza mientras el mazo del oponente o los modelos pesados se están inicializando.
 * Previene el Layout Shift drástico y mantiene la forma del área de juego con un CSS ghost effect.
 */
const ArenaSkeleton = () => {
    return (
        <div className="duel-arena-container tactical-mode" style={{ pointerEvents: 'none' }}>
            {/* AREA 1: 3D ARENA VIEWPORT Skeleton */}
            <div className="arena-viewport">
                <div className="playmat-board" style={{ border: '4px dashed rgba(255, 255, 255, 0.1)', background: 'transparent' }}>

                    {/* OPPONENT HALF SKELETON */}
                    <div className="half-board opponent">
                        <div className="zone-container active-zone animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                            <span className="zone-label" style={{ opacity: 0.1 }}>Active</span>
                            <div className="skeleton-card" />
                        </div>
                        <div className="zone-container bench-zone animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                            <span className="zone-label" style={{ opacity: 0.1 }}>Bench (Bot)</span>
                        </div>
                    </div>

                    <div className="playmat-divider" style={{ opacity: 0.2 }}></div>

                    {/* PLAYER HALF SKELETON */}
                    <div className="half-board player">
                        <div className="zone-container active-zone animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                            <span className="zone-label" style={{ opacity: 0.1 }}>Active</span>
                        </div>

                        <div className="zone-container bench-zone animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                            <span className="zone-label" style={{ opacity: 0.1 }}>Bench</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* AREA 2: 2D PLAYER DOCK Skeleton */}
            <div className="player-dock-2d" style={{ borderTopColor: 'gray' }}>
                <div className="dock-header">
                    <div className="dock-title animate-pulse" style={{ color: 'gray', background: 'rgba(255,255,255,0.1)', width: '150px', height: '20px', borderRadius: '4px' }}></div>
                    <div className="animate-pulse" style={{ background: 'rgba(255,255,255,0.1)', width: '120px', height: '35px', borderRadius: '20px' }}></div>
                </div>

                <div className="hand-cards-container">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="skeleton-card animate-pulse dock-card-wrapper"
                            style={{
                                width: '220px',
                                height: '320px',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '15px',
                                border: '2px dashed rgba(255, 255, 255, 0.1)'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Tailwind minimal animation logic if Tailwind is not present globally */}
            <style>
                {`
                @keyframes pulse-skeleton {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .5; }
                }
                .animate-pulse {
                    animation: pulse-skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .skeleton-card {
                    width: 15vw;
                    max-width: 200px;
                    height: 22vw;
                    max-height: 280px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                `}
            </style>
        </div>
    );
};

export default ArenaSkeleton;
