import React, { useMemo } from 'react';

// Helper for splitting damage into 50s and 10s tokens
const calculateTokens = (totalDamage) => {
    const tokens = [];
    let remaining = totalDamage;

    while (remaining >= 50) {
        tokens.push(50);
        remaining -= 50;
    }
    while (remaining >= 10) {
        tokens.push(10);
        remaining -= 10;
    }

    return tokens;
};

const DamageTokenOverlay = ({ totalDamage }) => {
    const tokens = useMemo(() => calculateTokens(totalDamage), [totalDamage]);

    if (totalDamage <= 0) return null;

    return (
        <div className="damage-token-overlay">
            {tokens.map((val, idx) => {
                // Pseudo-random but consistent rotation per token based on index
                const rotation = (idx * 37) % 60 - 30; // Random angle between -30 and 30
                const topOffset = 10 + (idx * 5) % 40; // Spread vertically
                const leftOffset = 10 + (idx * 15) % 50; // Spread horizontally

                return (
                    <div
                        key={`${val}-${idx}`}
                        className={`damage-token dt-${val}`}
                        style={{
                            top: `${topOffset}%`,
                            left: `${leftOffset}%`,
                            transform: `rotate(${rotation}deg) scale(0)`,
                            animationDelay: `${idx * 0.1}s` // Staggered appearance
                        }}
                    >
                        -{val}
                    </div>
                );
            })}
        </div>
    );
};

export default DamageTokenOverlay;
