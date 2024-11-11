import React, { useRef, useState } from 'react'
import classNames from 'classnames';

import "../../css/Board.css"
import Piece from './Piece';
import { isHorizontalPathClear, isPlayerPiece, isValidMove } from '../../helpers/utils';
import { BLACK_BISHOP, BLACK_KING, BLACK_KNIGHT, BLACK_PAWN, BLACK_QUEEN, BLACK_ROOK, WHITE_BISHOP, WHITE_KING, WHITE_KNIGHT, WHITE_PAWN, WHITE_QUEEN, WHITE_ROOK } from '../../constants';

//TODO: 
//next features:

// prevent illegal moves, something like isInCheck

// undo/redo

// game state in local storage

// backend

const ChessBoard = ({ playerTurn, changeTurn, onPieceTaken, onRestart }) => {
  const [board, setBoard] = useState(startBoard);
  const [winner, setWinner] = useState(null);

  const [prevMove, setPrevMove] = useState({
    movedPiece: 0,
    prevPos: { row: -1, col: -1 },
    newPos: { row: -1, col: -1 },
    pieceTaken: 0
  });

  const castlePiecesRef = useRef({
    whiteKing: { hasMoved: false },
    whiteRookKingSide: { hasMoved: false },
    whiteRookQueenSide: { hasMoved: false },
    blackKing: { hasMoved: false },
    blackRookKingSide: { hasMoved: false },
    blackRookQueenSide: { hasMoved: false }
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
    e.preventDefault();
  }

  const onPieceDrop = (e, pieceId, row, col) => {
    e.preventDefault();

    e.target.classList.remove('game-piece-drop-enter');
  
    const draggedPiece = draggedPieceRef.current;
    draggedPieceRef.current = null;

    const prevPos = { row: draggedPiece.row, col: draggedPiece.col };
    const newPos = { row, col };
    
    if (isValidMove(draggedPiece.pieceId, prevPos, newPos, board)) {
      handleMovePiece(draggedPiece.pieceId, pieceId, prevPos, newPos)

      // change this this is wrong
      if (pieceId === WHITE_KING) {
        setWinner("Black");
  
      } else if (pieceId === BLACK_KING) {
        setWinner("White");
  
      } else {
        changeTurn();
      } 

      // check if trying to castle 
    } else if (draggedPiece.pieceId === WHITE_KING || draggedPiece.pieceId === BLACK_KING) {
      
      const isKingSideCastleAttempt = prevPos.row === newPos.row && newPos.col - prevPos.col > 1;
      const isQueenSideCastleAttempt = prevPos.row === newPos.row && prevPos.col - newPos.col > 1;

      if (playerTurn === 'w' && !castlePiecesRef.current.whiteKing.hasMoved) {
        if (isKingSideCastleAttempt && isHorizontalPathClear(prevPos, newPos, board)) {
          handleWhiteKingSideCastle();
          changeTurn();
        }

        if (isQueenSideCastleAttempt && isHorizontalPathClear(prevPos, newPos, board)) {
          handleWhiteQueenSideCastle();
          changeTurn();
        }
      }

      if (playerTurn === 'b' && !castlePiecesRef.current.blackKing.hasMoved) {
        if (isKingSideCastleAttempt && isHorizontalPathClear(prevPos, newPos, board)) {
          handleBlackKingSideCastle();
          changeTurn();
        }

        if (isQueenSideCastleAttempt && isHorizontalPathClear(prevPos, newPos, board)) {
          handleBlackQueenSideCastle();
          changeTurn();
        }
      }
    }
  }

  const handleMovePiece = (draggedPieceId, droppedPieceId, prevPos, newPos) => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);

      // removed dragged piece from original square
      newBoard[prevPos.row][prevPos.col] = 0;
      // place old piece on dropped pos
      newBoard[newPos.row][newPos.col] = draggedPieceId;
      
      return newBoard;
    })

    if (droppedPieceId !== 0) {
      // dropped pos had enemy piece
      onPieceTaken(droppedPieceId);
    }

    setPrevMove({ 
      movedPiece: draggedPieceId, 
      prevPos,
      newPos, 
      pieceTaken: droppedPieceId
    });
  }

  const handleWhiteKingSideCastle = () => {
    if (!castlePiecesRef.current.whiteKing.hasMoved && !castlePiecesRef.current.whiteRookKingSide.hasMoved) {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
  
        newBoard[7][4] = 0;
        newBoard[7][6] = WHITE_KING;
        newBoard[7][7] = 0;
        newBoard[7][5] = WHITE_ROOK;
  
        castlePiecesRef.current.whiteKing.hasMoved = true;
        castlePiecesRef.current.whiteRookKingSide.hasMoved = true;
         
        return newBoard;
      });

      setPrevMove({
        movedPiece: WHITE_KING,
        prevPos: { row: 7, col: 4 },
        newPos: { row: 7, col: 6 },
        pieceTaken: 0
      });
    }
  }

  const handleWhiteQueenSideCastle = () => {
    if (!castlePiecesRef.current.whiteKing.hasMoved && !castlePiecesRef.current.whiteRookQueenSide.hasMoved) {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
  
        newBoard[7][4] = 0;
        newBoard[7][2] = WHITE_KING;
        newBoard[7][0] = 0;
        newBoard[7][3] = WHITE_ROOK;
  
        castlePiecesRef.current.whiteKing.hasMoved = true;
        castlePiecesRef.current.whiteRookQueenSide.hasMoved = true;
         
        return newBoard;
      });

      setPrevMove({
        movedPiece: WHITE_KING,
        prevPos: { row: 7, col: 4 },
        newPos: { row: 7, col: 2 },
        pieceTaken: 0
      });
    }
  }

  const handleBlackKingSideCastle = () => {
    if (!castlePiecesRef.current.blackKing.hasMoved && !castlePiecesRef.current.blackRookKingSide.hasMoved) {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
  
        newBoard[0][4] = 0;
        newBoard[0][6] = BLACK_KING;
        newBoard[0][7] = 0;
        newBoard[0][5] = BLACK_ROOK;
  
        castlePiecesRef.current.blackKing.hasMoved = true;
        castlePiecesRef.current.blackRookKingSide.hasMoved = true;
         
        return newBoard;
      });

      setPrevMove({
        movedPiece: BLACK_KING,
        prevPos: { row: 0, col: 4 },
        newPos: { row: 0, col: 6 },
        pieceTaken: 0
      });
    }
  }

  const handleBlackQueenSideCastle = () => {
    if (!castlePiecesRef.current.blackKing.hasMoved && !castlePiecesRef.current.blackRookQueenSide.hasMoved) {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
  
        newBoard[0][4] = 0;
        newBoard[0][2] = BLACK_KING;
        newBoard[0][0] = 0;
        newBoard[0][3] = BLACK_ROOK;
  
        castlePiecesRef.current.blackKing.hasMoved = true;
        castlePiecesRef.current.blackRookQueenSide.hasMoved = true;
         
        return newBoard;
      });

      setPrevMove({
        movedPiece: BLACK_KING,
        prevPos: { row: 0, col: 4 },
        newPos: { row: 0, col: 2 },
        pieceTaken: 0
      });
    }
  }

  const _onRestart = () => {
    onRestart();

    setWinner(null);

    setPrevMove({
      movedPiece: 0,
      prevPos: { row: -1, col: -1 },
      newPos: { row: -1, col: -1 },
      pieceTaken: 0
    });

    setBoard(startBoard);

    castlePiecesRef.current = {
      whiteKing: { hasMoved: false },
      whiteRookKingSide: { hasMoved: false },
      whiteRookQueenSide: { hasMoved: false },
      blackKing: { hasMoved: false },
      blackRookKingSide: { hasMoved: false },
      blackRookQueenSide: { hasMoved: false }
    };
  }
  
  return (
    <div className='board'>
      {winner && (
        <div className='game-finish-overlay'>
          <div className='game-finish-modal w-40 text-center' >
            <div>Winner is {winner}!</div>
            <button onClick={_onRestart}>Play again</button>
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
                      { 'bg-[rgb(184,139,74)]': !lightSquare },
                      { 'bg-[rgb(227,193,111)]': lightSquare },
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
                        { 'text-[rgb(227,193,111)]': !lightSquare },
                        { 'text-[rgb(184,139,74)]': lightSquare }
                      )}>
                        {rowIndex}
                      </div>
                    )}

                    {showAlphabet && (
                      <div className={classNames(
                        'game-square-alphabet-index',
                        { 'text-[rgb(184,139,74)]': lightSquare },
                        { 'text-[rgb(227,193,111)]': !lightSquare }
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
  [WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK]
];

const alphabetIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const isLightSquare = (row, col) => {
  const evenRow = row % 2 === 0;
  const evenCol = col % 2 === 0;

  return evenRow ? !evenCol : evenCol;
}

export default ChessBoard