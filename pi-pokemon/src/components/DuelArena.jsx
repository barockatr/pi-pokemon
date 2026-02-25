import React from 'react';
import DuelArenaContainer from './DuelArena/DuelArenaContainer';

// This file replaces the original DuelArena.jsx in its original path
// to prevent breaking any imports in HomePage.jsx or DetailPage.jsx
// while delegating the entire render logic to the new 3D architecture.

const DuelArena = () => {
    return <DuelArenaContainer />;
};

export default DuelArena;
