import React, { useCallback, useState } from 'react'
import ChessBoard from './board/ChessBoard';
import { isPlayerPiece } from '../lib/utils';
import { PIECE_ICONS } from '../constants';
import classNames from 'classnames';
import { publish } from '../lib/events/eventBus';
import { RESET_BOARD_EVENT } from '../lib/events/types';

const Game = ({ className }) => {
    const [playerTurn, setPlayerTurn] = useState('w');
    const [whiteTakenPieces, setWhiteTakenPieces] = useState([]);
    const [blackTakenPieces, setBlackTakenPieces] = useState([]);

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
    )
}

export default Game