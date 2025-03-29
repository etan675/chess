import React, { useCallback, useEffect, useState } from 'react'
import ChessBoard from './board/ChessBoard';
import { isPlayerPiece } from '../lib/utils';
import { BLACK_PIECES_TAKEN_KEY, BOARD_STATE_KEY, PIECE_ICONS, PLAYER_MOVE_KEY, START_BOARD, WHITE_PIECES_TAKEN_KEY } from '../constants';
import classNames from 'classnames';
import { publish } from '../lib/events/eventBus';
import { RESET_BOARD_EVENT } from '../lib/events/types';
import BoardContext from '../contexts/board-context';

//TODO:
const reducer = (currState, action) => {
    if (action.type === 'moveComplete') {
    
    }
}

const Game = ({ className }) => {
    const savedBoardStr = sessionStorage.getItem(BOARD_STATE_KEY);
    const savedBoard = savedBoardStr ? JSON.parse(savedBoardStr) : null;

    //TODO: 
    // Can refactor this to useReducer, including board history.
    const [board, setBoard] = useState(savedBoard || START_BOARD);

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
            setWhiteTakenPieces(prev => [...prev, pieceId])
        }

        if (isPlayerPiece(pieceId, 'b')) {
            setBlackTakenPieces(prev => [...prev, pieceId])
        }
    }

    const restartGame = useCallback(() => {
        setPlayerTurn('w');
        setWhiteTakenPieces([]);
        setBlackTakenPieces([]);
    }, []);

    const onRestart = useCallback(() => {
        publish(RESET_BOARD_EVENT);
        restartGame();
    }, [restartGame]);

    return (
        <BoardContext.Provider value={{ board, setBoard }}>
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
                    changeTurn={changeTurn}
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
                <div className='row-span-4 h-full flex flex-col justify-center items-start'>
                    <button
                        className={classNames(
                            'px-3 py-2 bg-amber-800 rounded-lg text-stone-50',
                            'text-sm border border-amber-900 shadow-sm',
                            'hover:bg-amber-900/70 active:scale-[0.98]'
                        )}
                        onClick={onRestart}
                    >
                        Restart
                    </button>
                </div>
            </div>
        </BoardContext.Provider>
    )
}

export default Game