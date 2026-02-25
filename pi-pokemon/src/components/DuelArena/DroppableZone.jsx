import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppableZone = ({ id, children, className, accept }) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            accepts: accept, // e.g., 'pokemon', 'energy', 'trainer'
        }
    });

    const style = {
        backgroundColor: isOver ? 'rgba(122, 199, 76, 0.2)' : 'rgba(0, 0, 0, 0.4)',
        border: isOver ? '2px dashed #7AC74C' : '2px dashed rgba(255, 255, 255, 0.2)',
        transition: 'all 0.2s ease',
        zIndex: isOver ? 50 : 1, // Elevate when hovered to guarantee drop detection in 3D
        position: 'relative'
    };

    return (
        <div ref={setNodeRef} style={style} className={`droppable-zone ${className}`}>
            {children}
        </div>
    );
};

export default DroppableZone;
