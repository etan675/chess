import React, { useState } from 'react'
import ChessBoard from './board/ChessBoard';

const Game = () => {
    const [playerTurn, setPlayerTurn] = useState('w');

    const changeTurn = () => {
        setPlayerTurn(prev => {
            if (prev === 'w') {
                return 'b';
        
            } else {
                return 'w';
            }
        });
    }

    return (
        <div className='flex flex-col items-center gap-6 py-6'>
            <ChessBoard 
                playerTurn={playerTurn}
                changeTurn={changeTurn}
            />
            <div className='w-full text-center text-2xl text-stone-300'>
                {playerTurn === 'w' ? 'White' : 'Black'}'s turn
            </div>
        </div>
    )
}

export default Game