import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearChallenger } from '../redux/actions';
import { calculateDamage } from '../utils/combatHelpers';
import './DuelArena.css';

const DuelArena = () => {
    const dispatch = useDispatch();
    const challenger = useSelector(state => state.challenger);

    const [opponent, setOpponent] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [attackerHp, setAttackerHp] = useState(100);
    const [defenderHp, setDefenderHp] = useState(100);
    const [isAnimating, setIsAnimating] = useState(false);
    const [result, setResult] = useState(null);

    // Nos suscribimos al evento global de "retador vs oponente"
    useEffect(() => {
        const handleDuel = (e) => {
            const opp = e.detail;
            setOpponent(opp);
            setBattleLog([]);
            setResult(null);
            setAttackerHp(100);
            setDefenderHp(100);
        };
        window.addEventListener('duel-request', handleDuel);
        return () => window.removeEventListener('duel-request', handleDuel);
    }, []);

    const runBattle = () => {
        if (!challenger || !opponent) return;
        setIsAnimating(true);

        const maxHp = Math.max(challenger.hp, opponent.hp, 50);
        const dmgToOpponent = calculateDamage(challenger, opponent, challenger.attackDamage);
        const dmgToChallenger = calculateDamage(opponent, challenger, opponent.attackDamage);

        const log = [];
        const atkHp = Math.max(0, 100 - Math.round((dmgToChallenger / maxHp) * 100));
        const defHp = Math.max(0, 100 - Math.round((dmgToOpponent / maxHp) * 100));

        log.push(`> ${challenger.name.toUpperCase()} ataca!`);
        log.push(`  Daño infligido: ${dmgToOpponent} pts`);
        if (dmgToOpponent > challenger.attackDamage) log.push(`  ⚡ ¡SÚPER EFECTIVO!`);
        log.push(`> ${opponent.name.toUpperCase()} contraataca!`);
        log.push(`  Daño infligido: ${dmgToChallenger} pts`);
        if (dmgToChallenger > opponent.attackDamage) log.push(`  ⚡ ¡SÚPER EFECTIVO!`);

        setTimeout(() => {
            setDefenderHp(defHp);
            setAttackerHp(atkHp);
            setBattleLog(log);

            if (dmgToOpponent > dmgToChallenger) {
                setResult(`🏆 ¡${challenger.name.toUpperCase()} GANA!`);
            } else if (dmgToChallenger > dmgToOpponent) {
                setResult(`🏆 ¡${opponent.name.toUpperCase()} GANA!`);
            } else {
                setResult('🤝 ¡EMPATE ÉPICO!');
            }
            setIsAnimating(false);
        }, 600);
    };

    const handleClose = () => {
        setOpponent(null);
        setResult(null);
        setBattleLog([]);
        dispatch(clearChallenger());
    };

    if (!opponent || !challenger) return null;

    return (
        <div className="arena-overlay">
            <div className="arena-modal">
                <h2 className="arena-title">⚔️ ARENA DE DUELO ⚔️</h2>

                <div className="arena-fighters">
                    {/* ATACANTE */}
                    <div className={`arena-fighter ${isAnimating ? 'fighter-attacking' : ''}`}>
                        <p className="fighter-name">{challenger.name.toUpperCase()}</p>
                        <p className="fighter-type">{challenger.type}</p>
                        <div className="hp-bar-container">
                            <span className="hp-label">HP</span>
                            <div className="hp-bar-bg">
                                <div
                                    className="hp-bar-fill"
                                    style={{
                                        width: `${attackerHp}%`,
                                        backgroundColor: attackerHp > 50 ? '#7AC74C' : attackerHp > 20 ? '#F7D02C' : '#EE8130'
                                    }}
                                />
                            </div>
                            <span className="hp-number">{attackerHp}%</span>
                        </div>
                    </div>

                    <div className="arena-vs">VS</div>

                    {/* DEFENSOR */}
                    <div className={`arena-fighter ${result && defenderHp < 50 ? 'fighter-shaking' : ''}`}>
                        <p className="fighter-name">{opponent.name.toUpperCase()}</p>
                        <p className="fighter-type">{opponent.type}</p>
                        <div className="hp-bar-container">
                            <span className="hp-label">HP</span>
                            <div className="hp-bar-bg">
                                <div
                                    className="hp-bar-fill"
                                    style={{
                                        width: `${defenderHp}%`,
                                        backgroundColor: defenderHp > 50 ? '#7AC74C' : defenderHp > 20 ? '#F7D02C' : '#EE8130'
                                    }}
                                />
                            </div>
                            <span className="hp-number">{defenderHp}%</span>
                        </div>
                    </div>
                </div>

                {/* LOG DE BATALLA */}
                {battleLog.length > 0 && (
                    <div className="arena-log">
                        {battleLog.map((line, i) => (
                            <p key={i} className={line.includes('SÚPER') ? 'log-super' : 'log-normal'}>{line}</p>
                        ))}
                    </div>
                )}

                {result && <p className="arena-result">{result}</p>}

                <div className="arena-actions">
                    {!result ? (
                        <button className="arena-btn fight-btn" onClick={runBattle} disabled={isAnimating}>
                            {isAnimating ? '💥 COMBATIENDO...' : '⚔️ ¡COMBATIR!'}
                        </button>
                    ) : null}
                    <button className="arena-btn close-btn" onClick={handleClose}>
                        CERRAR ARENA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuelArena;
