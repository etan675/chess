import React, { useState } from 'react'
import classNames from 'classnames';

import '../../css/Board.css';
import { ReactComponent as WhiteKing } from "../../images/pieceIcons/king_white.svg";
import { ReactComponent as WhiteQueen } from "../../images/pieceIcons/queen_white.svg";
import { ReactComponent as WhiteRook } from "../../images/pieceIcons/rook_white.svg";
import { ReactComponent as WhiteKnight } from "../../images/pieceIcons/knight_white.svg";
import { ReactComponent as WhiteBishop } from "../../images/pieceIcons/bishop_white.svg";
import { ReactComponent as WhitePawn } from "../../images/pieceIcons/pawn_white.svg";
import { ReactComponent as BlackKing } from "../../images/pieceIcons/king_black.svg";
import { ReactComponent as BlackQueen } from "../../images/pieceIcons/queen_black.svg";
import { ReactComponent as BlackRook } from "../../images/pieceIcons/rook_black.svg";
import { ReactComponent as BlackKnight } from "../../images/pieceIcons/knight_black.svg";
import { ReactComponent as BlackBishop } from "../../images/pieceIcons/bishop_black.svg";
import { ReactComponent as BlackPawn } from "../../images/pieceIcons/pawn_black.svg";

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
            {pieceIcons[pieceId]}
        </div>
    )
}

const pieceIcons = {
    1: <WhitePawn />,
    2: <WhiteBishop />,
    3: <WhiteKnight />,
    4: <WhiteRook />,
    5: <WhiteQueen />,
    6: <WhiteKing />,
    7: <BlackPawn />,
    8: <BlackBishop />,
    9: <BlackKnight />,
    10: <BlackRook />,
    11: <BlackQueen />,
    12: <BlackKing />,
};
  

export default Piece