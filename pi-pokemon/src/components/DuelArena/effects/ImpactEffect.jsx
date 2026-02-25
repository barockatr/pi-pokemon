import React, { useEffect, useState } from 'react';
import '../DuelArena.css';

const ImpactEffect = ({ isActive, onComplete }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isActive) {
            setShow(true);
            // Duration of animation
            const timer = setTimeout(() => {
                setShow(false);
                if (onComplete) onComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!show) return null;

    return (
        <div
            className="impact-effect-container"
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 100,
                pointerEvents: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <svg
                width="150"
                height="150"
                viewBox="0 0 200 200"
                className="impact-slash-anim"
                style={{
                    filter: 'drop-shadow(0 0 10px rgba(255,50,50,0.8))'
                }}
            >
                <path
                    d="M 20 180 L 180 20 M 20 20 L 180 180"
                    stroke="white"
                    strokeWidth="15"
                    strokeLinecap="round"
                    className="impact-path"
                />
                <circle cx="100" cy="100" r="80" stroke="rgba(255,0,0,0.6)" strokeWidth="10" fill="transparent" className="impact-circle" />
            </svg>
            {/* Inline styles for the animation if not using Framer Motion to keep deps light */}
            <style>{`
        @keyframes slashAnim {
          0% { stroke-dasharray: 0, 300; opacity: 1; transform: scale(0.8) rotate(-15deg); }
          50% { stroke-dasharray: 300, 0; opacity: 1; transform: scale(1.1) rotate(0deg); }
          100% { stroke-dasharray: 300, 0; opacity: 0; transform: scale(1.2) rotate(5deg); }
        }
        @keyframes blastAnim {
          0% { r: 10; opacity: 1; stroke-width: 20; }
          100% { r: 90; opacity: 0; stroke-width: 0; }
        }
        .impact-path {
          animation: slashAnim 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }
        .impact-circle {
          animation: blastAnim 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default ImpactEffect;
