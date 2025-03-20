import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames';

import "../../css/Board.css"
import { isLegalMove, isPlayerPiece, isKingsideCastleAttempt, isQueensideCastleAttempt, isHorizontalPathClear, getLegalSquares, isInCheck, isCheckMate } from '../../lib/utils';
import { PIECE_ICONS, BLACK_BISHOP, BLACK_KING, BLACK_KNIGHT, BLACK_PAWN, BLACK_QUEEN, BLACK_ROOK, WHITE_BISHOP, WHITE_KING, WHITE_KNIGHT, WHITE_PAWN, WHITE_QUEEN, WHITE_ROOK } from '../../constants';
import { subscribe } from '../../lib/events/eventBus';
import { RESET_BOARD_EVENT } from '../../lib/events/types';

const ChessBoard = ({ 
  playerTurn,
  changeTurn,
  onPieceTaken,
  onRestart,
}) => {
  const [board, setBoard] = useState(START_BOARD);
  const [winner, setWinner] = useState(null);

  const [prevMove, setPrevMove] = useState({
    movedPiece: 0,
    prevPos: { row: -1, col: -1 },
    newPos: { row: -1, col: -1 },
    pieceTaken: 0
  });

  const [legalSquares, setLegalSquares] = useState([]);

  const castlePiecesRef = useRef({
    whiteKing: { hasMoved: false },
    whiteRookKingside: { hasMoved: false },
    whiteRookQueenside: { hasMoved: false },
    blackKing: { hasMoved: false },
    blackRookKingside: { hasMoved: false },
    blackRookQueenside: { hasMoved: false }
  });

  const draggedPieceRef = useRef(null);
  const draggedOverSquareRef = useRef(null);

  useEffect(() => {
    if (isInCheck(playerTurn, board)) {
      if (isCheckMate(playerTurn, board)) {
        setWinner(playerTurn === 'w' ? 'White' : 'Black');
      }
    }
  }, [playerTurn, board]);

  const onPieceDragStart = (e, pieceId, row, col) => {
    draggedPieceRef.current = { pieceId, row, col };

    const highLightClass = isLightSquare(row, col) ? 'light-square-drag-highlight' : 'dark-square-drag-highlight';

    e.target.parentNode.classList.add(highLightClass);
  
    setLegalSquares(getLegalSquares(playerTurn, pieceId, { row, col }, board));
  }

  const onDragOver = (e) => {
    e.preventDefault();

    if (draggedOverSquareRef.current !== e.currentTarget) {
      draggedOverSquareRef.current?.classList.remove('game-piece-drag-over');
      draggedOverSquareRef.current = e.currentTarget;
      e.currentTarget.classList.add('game-piece-drag-over');
    }
  }
  
  const onPieceDragEnd = (e, row, col) => {
    const highLightClass = isLightSquare(row, col) ? 'light-square-drag-highlight' : 'dark-square-drag-highlight';

    e.target.parentNode.classList.remove(highLightClass);

    // drag finished, clear any styles applied by dragOver
    draggedOverSquareRef.current?.classList.remove('game-piece-drag-over');
    draggedOverSquareRef.current = null;

    setLegalSquares([]);
  }

  const onPieceDrop = (e, pieceId, row, col) => {
    e.preventDefault();
  
    const draggedPiece = draggedPieceRef.current;
    draggedPieceRef.current = null;

    const prevPos = { row: draggedPiece.row, col: draggedPiece.col };
    const newPos = { row, col };
    
    if (isLegalMove(playerTurn, draggedPiece.pieceId, prevPos, newPos, board)) {
      handleMovePiece(draggedPiece.pieceId, pieceId, prevPos, newPos);
      changeTurn();

    } else if (isKingsideCastleAttempt(playerTurn, draggedPiece.pieceId, prevPos, newPos)) {
      handleKingsideCastleAttempt(playerTurn);

    } else if (isQueensideCastleAttempt(playerTurn, draggedPiece.pieceId, prevPos, newPos)) {
      handleQueensideCastleAttempt(playerTurn);
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

  const handleKingsideCastleAttempt = (player) => {
    if (
      player === 'w' && 
      !castlePiecesRef.current.whiteKing.hasMoved && 
      !castlePiecesRef.current.whiteRookKingside.hasMoved &&
      isHorizontalPathClear(WK_START_POS, WRK_START_POS, board)
    ) {
      handleWhiteKingsideCastle();
      changeTurn();
    }
    
    if (
      player === 'b' && 
      !castlePiecesRef.current.blackKing.hasMoved &&
      !castlePiecesRef.current.blackRookKingside.hasMoved &&
      isHorizontalPathClear(BK_START_POS, BRK_START_POS, board)
    ) {
      handleBlackKingsideCastle();
      changeTurn();
    }
  }

  const handleQueensideCastleAttempt = (player) => {
    if (
      player === 'w' && 
      !castlePiecesRef.current.whiteKing.hasMoved &&
      !castlePiecesRef.current.whiteRookQueenside.hasMoved &&
      isHorizontalPathClear(WK_START_POS, WRQ_START_POS, board)
    ) {
      handleWhiteQueensideCastle();
      changeTurn();
    }

    if (
      player === 'b' &&
      !castlePiecesRef.current.blackKing.hasMoved &&
      !castlePiecesRef.current.blackRookQueenside.hasMoved &&
      isHorizontalPathClear(BK_START_POS, BRQ_START_POS, board)
    ) {
      handleBlackQueensideCastle();
      changeTurn();
    }
  }

  const handleWhiteKingsideCastle = () => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);

      newBoard[7][4] = 0;
      newBoard[7][6] = WHITE_KING;
      newBoard[7][7] = 0;
      newBoard[7][5] = WHITE_ROOK;

      castlePiecesRef.current.whiteKing.hasMoved = true;
      castlePiecesRef.current.whiteRookKingside.hasMoved = true;
      
      return newBoard;
    });

    setPrevMove({
      movedPiece: WHITE_KING,
      prevPos: { row: 7, col: 4 },
      newPos: { row: 7, col: 6 },
      pieceTaken: 0
    });
  }

  const handleWhiteQueensideCastle = () => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);

      newBoard[7][4] = 0;
      newBoard[7][2] = WHITE_KING;
      newBoard[7][0] = 0;
      newBoard[7][3] = WHITE_ROOK;

      castlePiecesRef.current.whiteKing.hasMoved = true;
      castlePiecesRef.current.whiteRookQueenside.hasMoved = true;
        
      return newBoard;
    });

    setPrevMove({
      movedPiece: WHITE_KING,
      prevPos: { row: 7, col: 4 },
      newPos: { row: 7, col: 2 },
      pieceTaken: 0
    });
  }

  const handleBlackKingsideCastle = () => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);

      newBoard[0][4] = 0;
      newBoard[0][6] = BLACK_KING;
      newBoard[0][7] = 0;
      newBoard[0][5] = BLACK_ROOK;

      castlePiecesRef.current.blackKing.hasMoved = true;
      castlePiecesRef.current.blackRookKingside.hasMoved = true;
        
      return newBoard;
    });

    setPrevMove({
      movedPiece: BLACK_KING,
      prevPos: { row: 0, col: 4 },
      newPos: { row: 0, col: 6 },
      pieceTaken: 0
    });
  }

  const handleBlackQueensideCastle = () => {
    setBoard(prev => {
      const newBoard = prev.map(row => [...row]);

      newBoard[0][4] = 0;
      newBoard[0][2] = BLACK_KING;
      newBoard[0][0] = 0;
      newBoard[0][3] = BLACK_ROOK;

      castlePiecesRef.current.blackKing.hasMoved = true;
      castlePiecesRef.current.blackRookQueenside.hasMoved = true;
        
      return newBoard;
    });

    setPrevMove({
      movedPiece: BLACK_KING,
      prevPos: { row: 0, col: 4 },
      newPos: { row: 0, col: 2 },
      pieceTaken: 0
    });
  }

  const _onRestart = useCallback(() => {
    onRestart();

    setWinner(null);

    setPrevMove({
      movedPiece: 0,
      prevPos: { row: -1, col: -1 },
      newPos: { row: -1, col: -1 },
      pieceTaken: 0
    });

    setBoard(START_BOARD);

    castlePiecesRef.current = {
      whiteKing: { hasMoved: false },
      whiteRookKingside: { hasMoved: false },
      whiteRookQueenside: { hasMoved: false },
      blackKing: { hasMoved: false },
      blackRookKingside: { hasMoved: false },
      blackRookQueenside: { hasMoved: false }
    };
  }, [onRestart])

  useEffect(() => {
    const unsubscribe = subscribe(RESET_BOARD_EVENT, () => {
      _onRestart();
    });

    return () => unsubscribe();
  }, [_onRestart]);

  return (
    <div className='board shadow-lg'>
      {winner && (
        <div className='absolute w-full h-full bg-gray-300 text-black bg-opacity-70 z-50'>
          <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-40 text-center' >
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

                const isLegalSquare = legalSquares.some(pos => {
                  return pos.row === i && pos.col === j;
                });

                return (
                  <div 
                    key={`${i}-${j}`}
                    className={classNames(
                      'game-square',
                      { 'bg-[rgb(184,139,74)]': !lightSquare },
                      { 'bg-[rgb(227,193,111)]': lightSquare },
                      { 'light-square-move-highlight': isPrevMove && lightSquare },
                      { 'dark-square-move-highlight': isPrevMove && !lightSquare },
                    )}
                  >
                    {isLegalSquare && pieceId === 0 && (
                      <div className='game-square-possible-move-indicator' />
                    )}

                    <div
                      className={classNames(
                        'game-piece',
                        { 'piece-capturable-indicator': isLegalSquare && pieceId !== 0 },
                      )}
                      draggable={draggable}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                    >
                      {PIECE_ICONS[pieceId]}
                    </div>

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

const START_BOARD = [
  [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK], 
  [BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN],
  [WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK]
];

const WK_START_POS = { row: 7, col: 4 };
const WRK_START_POS = { row: 7, col: 7 };
const WRQ_START_POS = { row: 7, col: 0 };
const BK_START_POS = { row: 0, col: 4 };
const BRK_START_POS = { row: 0, col: 7 };
const BRQ_START_POS = { row: 0, col: 0 };

const alphabetIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const isLightSquare = (row, col) => {
  const evenRow = row % 2 === 0;
  const evenCol = col % 2 === 0;

  return evenRow ? !evenCol : evenCol;
}

export default ChessBoard