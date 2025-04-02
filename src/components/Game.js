import React, { useCallback, useEffect, useReducer, useState } from 'react'
import ChessBoard from './board/ChessBoard';
import { isPlayerPiece } from '../lib/utils';
import { BLACK_KING, BLACK_PIECES_TAKEN_KEY, BLACK_ROOK, BOARD_STATE_KEY, BRK_START_POS, BRQ_START_POS, CASTLE_STATE_KEY, PIECE_ICONS, PLAYER_MOVE_KEY, START_BOARD, WHITE_KING, WHITE_PIECES_TAKEN_KEY, WHITE_ROOK, WRK_START_POS, WRQ_START_POS } from '../constants';
import classNames from 'classnames';
import { publish } from '../lib/events/eventBus';
import { RESET_BOARD_EVENT } from '../lib/events/types';
import BoardContext from '../contexts/board-context';
import { CASTLE, MOVE, REDO, RESTART, UNDO } from '../lib/actionTypes';

const initState = {
    board: START_BOARD,
    boardHistory: [{
        board: START_BOARD,
        move: null
    }],
    currMoveIndex: 0,
    castleContext: {
        wkMoved: false,
        wrkMoved: false,
        wrqMoved: false,
        bkMoved: false,
        brkMoved: false,
        brqMoved: false
    }
}

// Each move also needs a 'castle context', that way as we navigate 
// the board states with undo/redo, we are able to determine whether a particular 
// move was the first time a castle piece was moved, and re-allow castling accordingly.
const defaultMoveCastleContext = {
    isCastle: false,
    wkFirstMove: false,
    wrkFirstMove: false,
    wrqFirstMove: false,
    bkFirstMove: false,
    brkFirstMove: false,
    brqFirstMove: false
}

const reducer = (currState, action) => {
    const { board, boardHistory, currMoveIndex, castleContext } = currState;

    if (action.type === MOVE) {
        const { movedPieceId, prevPos, newPos, takenPieceId } = action.context;

        let newBoard = board.map(row => [...row]);
        let newBoardHistory = [...boardHistory];

        newBoard[prevPos.row][prevPos.col] = 0;
        newBoard[newPos.row][newPos.col] = movedPieceId;

        // check if moved one of the castle pieces
        let wkMoved = movedPieceId === WHITE_KING || castleContext.wkMoved;

        let wrkMoved = (
            movedPieceId === WHITE_ROOK &&
            prevPos.row === WRK_START_POS.row &&
            prevPos.col === WRK_START_POS.col
        ) || castleContext.wrkMoved;

        let wrqMoved = (
            movedPieceId === WHITE_ROOK &&
            prevPos.row === WRQ_START_POS.row &&
            prevPos.col === WRQ_START_POS.col
        ) || castleContext.wrqMoved;

        let bkMoved = movedPieceId === BLACK_KING || castleContext.bkMoved;

        let brkMoved = (
            movedPieceId === BLACK_ROOK &&
            prevPos.row === BRK_START_POS.row &&
            prevPos.col === BRK_START_POS.col
        ) || castleContext.brkMoved;

        let brqMoved = (
            movedPieceId === BLACK_ROOK &&
            prevPos.row === BRQ_START_POS.row &&
            prevPos.col === BRQ_START_POS.col
        ) || castleContext.brqMoved;

        if (currMoveIndex !== boardHistory.length - 1) {
            newBoardHistory = boardHistory.slice(0, currMoveIndex + 1);
        }

        newBoardHistory.push({
            board: newBoard,
            move: {
                movedPieceId,
                prevPos,
                newPos,
                takenPieceId,
                castleContext: {
                    ...defaultMoveCastleContext,
                    wkFirstMove: wkMoved && !castleContext.wkMoved,
                    wrkFirstMove: wrkMoved && !castleContext.wrkMoved,
                    wrqFirstMove: wrqMoved && !castleContext.wrqMoved,
                    bkFirstMove: bkMoved && !castleContext.bkMoved,
                    brkFirstMove: brkMoved && !castleContext.brkMoved,
                    brqFirstMove: brqMoved && !castleContext.brqMoved,
                }
            }
        });

        return {
            ...currState,
            board: newBoard,
            boardHistory: newBoardHistory,
            currMoveIndex: currMoveIndex + 1,
            castleContext: {
                wkMoved,
                wrkMoved,
                wrqMoved,
                bkMoved,
                brkMoved,
                brqMoved,
            }
        };
    }

    if (action.type === CASTLE) {
        const { player, side } = action.context;

        let newBoard = board.map(row => [...row]);
        let newBoardHistory = [...boardHistory];
        let move = null;

        let wkMoved = castleContext.wkMoved;
        let wrkMoved = castleContext.wrkMoved;
        let wrqMoved = castleContext.wrqMoved;
        let bkMoved = castleContext.bkMoved;
        let brkMoved = castleContext.brkMoved;
        let brqMoved = castleContext.brqMoved;

        if (player === 'b') {
            bkMoved = true;

            if (side === 'k') {
                newBoard[0][4] = 0;
                newBoard[0][6] = BLACK_KING;
                newBoard[0][7] = 0;
                newBoard[0][5] = BLACK_ROOK;

                move = {
                    movedPieceId: BLACK_KING,
                    prevPos: { row: 0, col: 4 },
                    newPos: { row: 0, col: 6 },
                    takenPieceId: 0,
                    castleContext: {
                        ...defaultMoveCastleContext,
                        isCastle: true,
                        bkFirstMove: true,
                        brkFirstMove: true,
                    }
                }

                brkMoved = true;

            } else if (side === 'q') {
                newBoard[0][4] = 0;
                newBoard[0][2] = BLACK_KING;
                newBoard[0][0] = 0;
                newBoard[0][3] = BLACK_ROOK;

                move = {
                    movedPieceId: BLACK_KING,
                    prevPos: { row: 0, col: 4 },
                    newPos: { row: 0, col: 2 },
                    takenPieceId: 0,
                    castleContext: {
                        ...defaultMoveCastleContext,
                        isCastle: true,
                        bkFirstMove: true,
                        brqFirstMove: true,
                    }
                }

                brqMoved = true;
            }

        } else if (player === 'w') {
            wkMoved = true;

            if (side === 'k') {
                newBoard[7][4] = 0;
                newBoard[7][6] = WHITE_KING;
                newBoard[7][7] = 0;
                newBoard[7][5] = WHITE_ROOK;

                move = {
                    movedPiece: WHITE_KING,
                    prevPos: { row: 7, col: 4 },
                    newPos: { row: 7, col: 6 },
                    takenPieceId: 0,
                    castleContext: {
                        ...defaultMoveCastleContext,
                        isCastle: true,
                        wkFirstMove: true,
                        wrkFirstMove: true,
                    }
                }

                wrkMoved = true;

            } else if (side === 'q') {
                newBoard[7][4] = 0;
                newBoard[7][2] = WHITE_KING;
                newBoard[7][0] = 0;
                newBoard[7][3] = WHITE_ROOK;

                move = {
                    movedPiece: WHITE_KING,
                    prevPos: { row: 7, col: 4 },
                    newPos: { row: 7, col: 2 },
                    takenPieceId: 0,
                    castleContext: {
                        ...defaultMoveCastleContext,
                        isCastle: true,
                        wkFirstMove: true,
                        wrqFirstMove: true,
                    }
                }

                wrqMoved = true;
            }
        }

        if (currMoveIndex !== boardHistory.length - 1) {
            newBoardHistory = boardHistory.slice(0, currMoveIndex + 1);
        }

        newBoardHistory.push({ board: newBoard, move });

        return {
            ...currState,
            board: newBoard,
            boardHistory: newBoardHistory,
            currMoveIndex: currMoveIndex + 1,
            castleContext: {
                wkMoved,
                wrkMoved,
                wrqMoved,
                bkMoved,
                brkMoved,
                brqMoved,
            }
        }
    }

    if (action.type === UNDO) {
        const moveCastleContext = boardHistory[currMoveIndex].move?.castleContext;

        let wkFirstMove = moveCastleContext?.wkFirstMove || false;
        let wrkFirstMove = moveCastleContext?.wrkFirstMove || false;
        let wrqFirstMove = moveCastleContext?.wrqFirstMove || false;
        let bkFirstMove = moveCastleContext?.bkFirstMove || false;
        let brkFirstMove = moveCastleContext?.brkFirstMove || false;
        let brqFirstMove = moveCastleContext?.brqFirstMove || false;

        const prevMoveIndex = currMoveIndex - 1;

        return {
            ...currState,
            board: boardHistory[prevMoveIndex].board,
            currMoveIndex: prevMoveIndex,
            castleContext: {
                wkMoved: wkFirstMove ? false : castleContext.wkMoved,
                wrkMoved: wrkFirstMove ? false : castleContext.wrkMoved,
                wrqMoved: wrqFirstMove ? false : castleContext.wrqMoved,
                bkMoved: bkFirstMove ? false : castleContext.bkMoved,
                brkMoved: brkFirstMove ? false : castleContext.brkMoved,
                brqMoved: brqFirstMove ? false : castleContext.brqMoved,
            }
        }
    }

    if (action.type === REDO) {
        const nextMoveIndex = currMoveIndex + 1;
        const moveCastleContext = boardHistory[nextMoveIndex].move?.castleContext;

        let wkFirstMove = moveCastleContext?.wkFirstMove || false;
        let wrkFirstMove = moveCastleContext?.wrkFirstMove || false;
        let wrqFirstMove = moveCastleContext?.wrqFirstMove || false;
        let bkFirstMove = moveCastleContext?.bkFirstMove || false;
        let brkFirstMove = moveCastleContext?.brkFirstMove || false;
        let brqFirstMove = moveCastleContext?.brqFirstMove || false;

        return {
            ...currState,
            board: boardHistory[nextMoveIndex].board,
            currMoveIndex: nextMoveIndex,
            castleContext: {
                wkMoved: wkFirstMove ? true : castleContext.wkMoved,
                wrkMoved: wrkFirstMove ? true : castleContext.wrkMoved,
                wrqMoved: wrqFirstMove ? true : castleContext.wrqMoved,
                bkMoved: bkFirstMove ? true : castleContext.bkMoved,
                brkMoved: brkFirstMove ? true : castleContext.brkMoved,
                brqMoved: brqFirstMove ? true : castleContext.brqMoved,
            }
        }
    }

    if (action.type === RESTART) {
        return { ...initState };
    }

    return currState;
}

const Game = ({ className }) => {
    const savedBoardStr = sessionStorage.getItem(BOARD_STATE_KEY);
    const savedBoard = savedBoardStr ? JSON.parse(savedBoardStr) : null;
    const savedCastleStateStr = sessionStorage.getItem(CASTLE_STATE_KEY);
    const savedCastleState = savedCastleStateStr ? JSON.parse(savedCastleStateStr) : null;

    const [gameState, dispatch] = useReducer(reducer, {
        ...initState,
        board: savedBoard || START_BOARD,
        boardHistory: [{ board: savedBoard || START_BOARD, move: null }],
        castleContext: savedCastleState || initState.castleContext
    });

    const savedPlayerTurn = sessionStorage.getItem(PLAYER_MOVE_KEY);
    const savedWpTakenStr = sessionStorage.getItem(WHITE_PIECES_TAKEN_KEY);
    const savedWpTaken = savedWpTakenStr ? JSON.parse(savedWpTakenStr) : null;
    const savedBpTakenStr = sessionStorage.getItem(BLACK_PIECES_TAKEN_KEY);
    const savedBpTaken = savedBpTakenStr ? JSON.parse(savedBpTakenStr) : null;

    const [playerTurn, setPlayerTurn] = useState(savedPlayerTurn || 'w');
    const [whiteTakenPieces, setWhiteTakenPieces] = useState(savedWpTaken || []);
    const [blackTakenPieces, setBlackTakenPieces] = useState(savedBpTaken || []);

    useEffect(() => {
        sessionStorage.setItem(PLAYER_MOVE_KEY, playerTurn);
        sessionStorage.setItem(WHITE_PIECES_TAKEN_KEY, JSON.stringify(whiteTakenPieces));
        sessionStorage.setItem(BLACK_PIECES_TAKEN_KEY, JSON.stringify(blackTakenPieces));
    }, [playerTurn, whiteTakenPieces, blackTakenPieces]);

    useEffect(() => {
        sessionStorage.setItem(BOARD_STATE_KEY, JSON.stringify(gameState.board));
    }, [gameState.board]);

    useEffect(() => {
        sessionStorage.setItem(CASTLE_STATE_KEY, JSON.stringify(gameState.castleContext));
    }, [gameState.castleContext]);

    const changeTurn = () => {
        setPlayerTurn(prev => {
            if (prev === 'w') {
                return 'b';

            } else {
                return 'w';
            }
        });
    }

    const onPieceTaken = (pieceId) => {
        if (isPlayerPiece(pieceId, 'w')) {
            setWhiteTakenPieces(prev => [...prev, pieceId]);
        }

        if (isPlayerPiece(pieceId, 'b')) {
            setBlackTakenPieces(prev => [...prev, pieceId]);
        }
    }

    const restartGame = useCallback(() => {
        dispatch({ type: RESTART })
        setPlayerTurn('w');
        setWhiteTakenPieces([]);
        setBlackTakenPieces([]);
    }, []);

    const onRestart = () => {
        publish(RESET_BOARD_EVENT);
        restartGame();
    };

    const onMove = (movedPieceId, prevPos, newPos, takenPieceId = 0) => {
        dispatch({
            type: MOVE,
            context: {
                movedPieceId,
                prevPos,
                newPos,
                takenPieceId
            }
        });

        changeTurn();
    }

    const onCastle = (player, side) => {
        dispatch({ type: CASTLE, context: { player, side } });
        changeTurn();
    }

    const hasUndo = gameState.currMoveIndex > 0;
    const hasRedo = gameState.currMoveIndex < gameState.boardHistory.length - 1;

    const onUndo = () => {
        if (hasUndo) {
            dispatch({ type: UNDO });
            changeTurn();
        }
    }

    const onRedo = () => {
        if (hasRedo) {
            dispatch({ type: REDO });
            changeTurn();
        }
    }

    return (
        <BoardContext.Provider
            value={{
                board: gameState.board,
                prevMove: gameState.boardHistory[gameState.currMoveIndex]?.move ?? null,
                castleContext: gameState.castleContext,
                onMove,
                onCastle,
            }}
        >
            <div className={classNames(
                'grid grid-cols-[minmax(min-content,_520px),_minmax(min-content,_380px)]',
                'rid-rows-[min-content,_1fr,_min-content,_min-content] grid-flow-col',
                'items-center gap-y-4 gap-x-8 py-4',
                className
            )}>
                <div className='player-taken-pieces-container'>
                    {whiteTakenPieces.map((pieceId, index) => {
                        return (
                            <div key={index} className='w-8 h-8'>
                                {PIECE_ICONS[pieceId]}
                            </div>
                        )
                    })}
                </div>
                <ChessBoard
                    playerTurn={playerTurn}
                    onPieceTaken={onPieceTaken}
                    onRestart={restartGame}
                />
                <div className='player-taken-pieces-container'>
                    {blackTakenPieces.map((pieceId, index) => {
                        return (
                            <div key={index} className='w-8 h-8'>
                                {PIECE_ICONS[pieceId]}
                            </div>
                        )
                    })}
                </div>
                <div className='w-full text-center text-lg text-stone-50'>
                    {playerTurn === 'w' ? 'White' : 'Black'}'s turn
                </div>
                <div className='row-span-4 h-full flex flex-col gap-2 justify-center items-start'>
                    <button
                        className={classNames(
                            'px-3 py-2 bg-amber-800 rounded-lg text-stone-50',
                            'text-sm border border-amber-900 shadow-sm mb-4',
                            'hover:bg-amber-900/70 active:scale-[0.98]'
                        )}
                        onClick={onRestart}
                    >
                        Restart
                    </button>
                    <button
                        className={classNames(
                            'px-3 py-2 bg-amber-800 rounded-lg text-stone-50',
                            'text-sm border border-amber-900 shadow-sm',
                            'hover:bg-amber-900/70 active:scale-[0.98]',
                            { 'pointer-events-none opacity-60': !hasUndo }
                        )}
                        onClick={onUndo}
                        disabled={!hasUndo}
                    >
                        Undo
                    </button>
                    <button
                        className={classNames(
                            'px-3 py-2 bg-amber-800 rounded-lg text-stone-50',
                            'text-sm border border-amber-900 shadow-sm',
                            'hover:bg-amber-900/70 active:scale-[0.98]',
                            { 'pointer-events-none opacity-60': !hasRedo }
                        )}
                        onClick={onRedo}
                        disabled={!hasRedo}
                    >
                        Redo
                    </button>
                </div>
            </div>
        </BoardContext.Provider>
    )
}

export default Game