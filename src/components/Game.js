import React, { useState } from 'react'
import ChessBoard from './board/ChessBoard';
import { isPlayerPiece } from '../helpers/utils';
import { PIECE_ICONS } from '../constants';

const Game = () => {
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

    const onRestart = () => {
        setPlayerTurn('w');
        setWhiteTakenPieces([]);
        setBlackTakenPieces([]);
    }
    
    return (
        <div className='flex flex-col items-center gap-3 py-3'>
            <div className='player-taken-pieces-container'>
                {whiteTakenPieces.map(pieceId => {
                    return (
                        <div className='w-8 h-8'>{PIECE_ICONS[pieceId]}</div>
                    )
                })}
            </div>
             <ChessBoard 
                playerTurn={playerTurn}
                changeTurn={changeTurn}
                onPieceTaken={onPieceTaken}
                onRestart={onRestart}
            />
            <div className='player-taken-pieces-container'>
                {blackTakenPieces.map(pieceId => {
                    return (
                        <div className='w-8 h-8'>{PIECE_ICONS[pieceId]}</div>
                    )
                })}
            </div>

            <div className='w-full text-center text-2xl text-stone-300'>
                {playerTurn === 'w' ? 'White' : 'Black'}'s turn
            </div>
        </div>
    )
}

export default Game