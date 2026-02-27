import React from 'react';
import './CardSkeleton.css';

const CardSkeleton = () => {
    return (
        <div className="tcg-skeleton-card">
            <div className="skeleton-glimmer"></div>
            <div className="skel-header">
                <div className="skel-title"></div>
                <div className="skel-hp"></div>
            </div>
            <div className="skel-image-box"></div>
            <div className="skel-types">
                <div className="skel-pill"></div>
                <div className="skel-pill"></div>
            </div>
            <div className="skel-stats">
                <div className="skel-stat"></div>
                <div className="skel-stat"></div>
                <div className="skel-stat"></div>
            </div>
            <div className="skel-footer"></div>
        </div>
    );
};

export default CardSkeleton;
