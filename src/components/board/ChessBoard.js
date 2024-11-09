import React, { useRef, useState } from 'react'
import classNames from 'classnames';

import "../../css/Board.css"
import Piece from './Piece';
import { isPlayerPiece, isValidMove } from '../../helpers/utils';
import { BLACK_BISHOP, BLACK_KING, BLACK_KNIGHT, BLACK_PAWN, BLACK_QUEEN, BLACK_ROOK, WHITE_BISHOP, WHITE_KING, WHITE_KNIGHT, WHITE_PAWN, WHITE_QUEEN, WHITE_ROOK } from '../../constants';

//TODO: 
//possible features:

// prevent illegal moves

// undo/redo

// game state in local storage

// backend

const ChessBoard = ({ playerTurn, changeTurn, onPieceTaken }) => {
  const [board, setBoard] = useState(startBoard);
  const [winner, setWinner] = useState(null);

  const [prevMove, setPrevMove] = useState({
    movedPiece: 0,
    prevPos: { row: -1, col: -1 },
    newPos: { row: -1, col: -1 },
    pieceTaken: 0
  });

  const draggedPieceRef = useRef(null);

  const onPieceDragStart = (e, pieceId, row, col) => {
    draggedPieceRef.current = { pieceId, row, col };

    const highLightClass = isLightSquare(row, col) ? 'light-square-drag-highlight' : 'dark-square-drag-highlight';

    e.target.parentNode.classList.add(highLightClass);
  }
  
  const onPieceDragEnd = (e, row, col) => {
    const highLightClass = isLightSquare(row, col) ? 'light-square-drag-highlight' : 'dark-square-drag-highlight';

    e.target.parentNode.classList.remove(highLightClass);
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

      if (pieceId !== 0) {
        // dropped pos had enemy piece
        onPieceTaken(pieceId);
      }

      setPrevMove({
        movedPiece: draggedPiece.pieceId, 
        prevPos: { row: draggedPiece.row, col: draggedPiece.col },
        newPos: { row, col },
        pieceTaken: pieceId
      });

      if (pieceId === WHITE_KING) {
        setWinner("Black");
  
      } else if (pieceId === BLACK_KING) {
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
    <div className='board'>
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
          return (
            <div key={i} className='w-full grid grid-cols-8'>
              {row.map((pieceId, j) => {
                const draggable = isPlayerPiece(pieceId, playerTurn);

                const lightSquare = isLightSquare(i, j);
                
                const onDragStart = (e) => {
                  onPieceDragStart(e, pieceId, i, j);
                }

                const onDragEnd = (e) => {
                  onPieceDragEnd(e, i, j);
                }

                const onDrop = (e) => {
                  onPieceDrop(e, pieceId, i, j);
                }

                const showIndex = j === 0;
                const showAlphabet = i === board.length - 1;

                const rowIndex = 8 - i;

                const isPrevMove = (
                  (prevMove.prevPos.row === i && prevMove.prevPos.col === j) || 
                  (prevMove.newPos.row === i && prevMove.newPos.col === j)
                );

                return (
                  <div 
                    key={`${i}-${j}`}
                    className={classNames(
                      'game-square',
                      'relative',
                      { 'bg-[brown]': !lightSquare },
                      { 'bg-[beige]': lightSquare },
                      { 'light-square-move-highlight': isPrevMove && lightSquare },
                      { 'dark-square-move-highlight': isPrevMove && !lightSquare }
                    )}
                  >
                    <Piece 
                      pieceId={pieceId}
                      draggable={draggable}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onDragEnter={onDragEnter}
                      onDragLeave={onDragLeave}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                    />

                    {showIndex && (
                      <div className={classNames(
                        'game-square-number-index',
                        { 'text-[beige]': !lightSquare },
                        { 'text-[brown]': lightSquare }
                      )}>
                        {rowIndex}
                      </div>
                    )}

                    {showAlphabet && (
                      <div className={classNames(
                        'game-square-alphabet-index',
                        { 'text-[brown]': lightSquare },
                        { 'text-[beige]': !lightSquare }
                      )}>
                        {alphabetIndex[j]}
                      </div>
                    )}
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
  [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK], 
  [BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN],
  [WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_PAWN]
];

const alphabetIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const isLightSquare = (row, col) => {
  const evenRow = row % 2 === 0;
  const evenCol = col % 2 === 0;

  return evenRow ? !evenCol : evenCol;
}

export default ChessBoard