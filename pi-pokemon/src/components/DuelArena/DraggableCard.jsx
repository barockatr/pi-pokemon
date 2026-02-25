import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import Card from '../Card';

const DraggableCard = ({ pokemon, id, isDraggable = true, disabled = false, children }) => {
    console.log(`DraggableCard ${pokemon.name} - isDraggable:`, isDraggable, 'disabled:', disabled);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { pokemon },
        // Temporarily commented out to FORCE drag start 
        // disabled: !isDraggable || disabled
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 99999 : 10, // Force extremely high zIndex when dragging
        opacity: isDragging ? 0.4 : 1, // Reduced opacity to see targets behind
        cursor: isDraggable && !disabled ? 'grab' : 'default',
        filter: disabled ? 'grayscale(80%)' : 'none',
        transition: isDragging ? 'none' : 'transform 0.1s ease', // Faster snapback
        touchAction: 'none', // Critical for dragging on modern browsers
        position: 'relative' // Ensure z-index works
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`draggable-card-wrapper ${isDragging ? 'is-dragging' : ''}`}
        >
            {children || (
                <div className="card-container">
                    <Card {...pokemon} isArena={true} />
                </div>
            )}
        </div>
    );
};

export default DraggableCard;
