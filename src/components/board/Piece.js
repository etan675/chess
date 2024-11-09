import React, { useState } from 'react'
import classNames from 'classnames';

import '../../css/Board.css';
import { PIECE_ICONS } from '../../constants';

const Piece = ({ 
    pieceId,
    draggable,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const _onDragStart = (e) => {
        onDragStart(e);
        
        setIsDragging(true);
    }

    const _onDragEnd = (e) => {
        onDragEnd(e);

        setIsDragging(false);
    }

    return (
        <div
            className={classNames(
                'game-piece',
                { 'z-10 relative': isDragging }
            )}
            draggable={draggable}
            onDragStart={_onDragStart}
            onDragEnd={_onDragEnd}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {PIECE_ICONS[pieceId]}
        </div>
    )
}

export default Piece