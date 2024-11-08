import React, { useRef, useState } from 'react'
import classNames from 'classnames';

import "../../css/Board.css"
import Piece from './Piece';
import { isPlayerPiece, isValidMove } from '../../helpers/utils';

//TODO: 
//possible sfeatures

// implement chess rules

// track taken pieces, (state will prob live in a diff component)

// prev move highlighting

// game state in local storage

// undo/redo

// backend

const ChessBoard = ({ playerTurn, changeTurn }) => {
  const [board, setBoard] = useState(startBoard);
  const [winner, setWinner] = useState(null);

  const draggedPieceRef = useRef(null);

  const onPieceDragStart = (e, pieceId, row, col) => {
    draggedPieceRef.current = { pieceId, row, col };

    e.target.parentNode.classList.add('game-square-drag-overlay');
  }

  const onPieceDragEnd = (e) => {
    e.target.parentNode.classList.remove('game-square-drag-overlay');
  }

  const onDragEnter = (e) => {
    e.target.classList.add('game-piece-drop-enter');
  }

  const onDragLeave = (e) => {
    e.target.classList.remove('game-piece-drop-enter');
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onPieceDrop = (e, pieceId, row, col) => {
    e.preventDefault();

    e.target.classList.remove('game-piece-drop-enter');
  
    const draggedPiece = draggedPieceRef.current;
    draggedPieceRef.current = null;

    const validMove = isValidMove(
      draggedPiece.pieceId,
      { row: draggedPiece.row, col: draggedPiece.col },
      { row, col },
      board
    );
    
    if (validMove) {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
  
        // removed dragged piece from original square
        newBoard[draggedPiece.row][draggedPiece.col] = 0;
        // place old piece on dropped pos
        newBoard[row][col] = draggedPiece.pieceId;
        
        return newBoard;
      })
  
      // 6 is white king and 12 is black king
      if (pieceId === 6) {
        setWinner("Black");
  
      } else if (pieceId === 12) {
        setWinner("White");
  
      } else {
  
        changeTurn();
      } 
    }
  }

  const onRestart = () => {
    setWinner(null);

    setBoard(startBoard);
  }
  
  return (
    <div className='board-container'>
      {winner && (
        <div className='game-finish-overlay'>
          <div className='game-finish-modal w-40 text-center' >
            <div>Winner is {winner}!</div>
            <button onClick={onRestart}>Play again</button>
          </div>
        </div>
      )}

      <div className='w-full h-full grid grid-rows-8'>
        {board.map((row, i) => {
          const evenRow = i % 2 === 0;

          return (
            <div key={i} className='w-full grid grid-cols-8'>
              {row.map((pieceId, j) => {
                const draggable = isPlayerPiece(pieceId, playerTurn);

                const evenCol = j % 2 === 0;
                const oddCol = !evenCol;
                
                const onDragStart = (e) => {
                  onPieceDragStart(e, pieceId, i, j);
                }

                const onDrop = (e) => {
                  onPieceDrop(e, pieceId, i, j);
                } 

                return (
                  <div 
                    key={j} 
                    className={classNames(
                      'game-square',
                      { 'bg-[brown]': evenRow ? evenCol : oddCol },
                      { 'bg-[beige]': evenRow ? oddCol : evenCol }
                    )}
                  >
                    <Piece 
                      pieceId={pieceId}
                      draggable={draggable}
                      onDragStart={onDragStart}
                      onDragEnd={onPieceDragEnd}
                      onDragEnter={onDragEnter}
                      onDragLeave={onDragLeave}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                    />
                  </div>
                )
              })}
          </div>
          )
        })}
      </div>
    </div>
  )
}

// 0: empty square

// 1: white pawn
// 2: white bishop
// 3: white knight
// 4: white rook
// 5: white queen
// 6: white knight

// 7: black pawn
// 8: black bishop
// 9: black knight
// 10: black rook
// 11: black queen
// 12: black king

const startBoard = [
  [10, 9, 8, 11, 12, 8, 9, 10], 
  [7, 7, 7, 7, 7, 7, 7, 7],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [4, 3, 2, 5, 6, 2, 3, 4]
];

export default ChessBoard