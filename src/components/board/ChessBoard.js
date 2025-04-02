import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames';

import "../../css/Board.css"
import { isLegalMove, isPlayerPiece, isKingsideCastleAttempt, isQueensideCastleAttempt, isHorizontalPathClear, getLegalSquares, isInCheck, isCheckMate } from '../../lib/utils';
import { PIECE_ICONS, BOARD_STATE_KEY } from '../../constants';
import { subscribe } from '../../lib/events/eventBus';
import { RESET_BOARD_EVENT } from '../../lib/events/types';
import boardContext from '../../contexts/board-context';

const ChessBoard = ({
  playerTurn,
  onPieceTaken,
  onRestart,
}) => {
  const { board, prevMove, onMove, onCastle } = useContext(boardContext);

  const [winner, setWinner] = useState(null);
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
        setWinner(playerTurn === 'b' ? 'White' : 'Black');
      }
    }
  }, [playerTurn, board]);

  useEffect(() => {
    sessionStorage.setItem(BOARD_STATE_KEY, JSON.stringify(board));
  }, [board]);

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

    } else if (isKingsideCastleAttempt(playerTurn, draggedPiece.pieceId, prevPos, newPos)) {
      handleKingsideCastleAttempt(playerTurn);

    } else if (isQueensideCastleAttempt(playerTurn, draggedPiece.pieceId, prevPos, newPos)) {
      handleQueensideCastleAttempt(playerTurn);
    }
  }

  const handleMovePiece = (draggedPieceId, droppedPieceId, prevPos, newPos) => {
    onMove(draggedPieceId, prevPos, newPos, droppedPieceId);

    if (droppedPieceId !== 0) {
      // dropped pos had enemy piece
      onPieceTaken(droppedPieceId);
    }
  }

  const handleKingsideCastleAttempt = (player) => {
    if (
      player === 'w' &&
      !castlePiecesRef.current.whiteKing.hasMoved &&
      !castlePiecesRef.current.whiteRookKingside.hasMoved &&
      isHorizontalPathClear(WK_START_POS, WRK_START_POS, board)
    ) {
      onCastle('w', 'k');
    }

    if (
      player === 'b' &&
      !castlePiecesRef.current.blackKing.hasMoved &&
      !castlePiecesRef.current.blackRookKingside.hasMoved &&
      isHorizontalPathClear(BK_START_POS, BRK_START_POS, board)
    ) {
      onCastle('b', 'k');
    }
  }

  const handleQueensideCastleAttempt = (player) => {
    if (
      player === 'w' &&
      !castlePiecesRef.current.whiteKing.hasMoved &&
      !castlePiecesRef.current.whiteRookQueenside.hasMoved &&
      isHorizontalPathClear(WK_START_POS, WRQ_START_POS, board)
    ) {
      onCastle('w', 'q');
    }

    if (
      player === 'b' &&
      !castlePiecesRef.current.blackKing.hasMoved &&
      !castlePiecesRef.current.blackRookQueenside.hasMoved &&
      isHorizontalPathClear(BK_START_POS, BRQ_START_POS, board)
    ) {
      onCastle('b', 'q');
    }
  }

  const _onRestart = useCallback(() => {
    onRestart();
    setWinner(null);

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
            <button
              className='hover:bg-gray-500/10 px-3 py-1 rounded-lg'
              onClick={_onRestart}
            >
              Play again
            </button>
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

                const isPrevMove = prevMove && (
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

// white king
const WK_START_POS = { row: 7, col: 4 };
// white rook kingside
const WRK_START_POS = { row: 7, col: 7 };
// white rook queenside
const WRQ_START_POS = { row: 7, col: 0 };
// black king
const BK_START_POS = { row: 0, col: 4 };
// black rook kingside
const BRK_START_POS = { row: 0, col: 7 };
// black rook queenside
const BRQ_START_POS = { row: 0, col: 0 };

const alphabetIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const isLightSquare = (row, col) => {
  const evenRow = row % 2 === 0;
  const evenCol = col % 2 === 0;

  return evenRow ? !evenCol : evenCol;
}

export default ChessBoard