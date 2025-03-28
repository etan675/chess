import React, { useState } from 'react'
import boardContext from '../contexts/board-context'
import { BOARD_STATE_KEY, START_BOARD } from '../constants';

const BoardContext = boardContext;

const BoardContextProvider = ({ children }) => {
    const savedBoardStr = sessionStorage.getItem(BOARD_STATE_KEY);
    const savedBoard = savedBoardStr ? JSON.parse(savedBoardStr) : null;
  
    const [board, setBoard] = useState(savedBoard || START_BOARD);

    return (
        <BoardContext.Provider value={{ board, setBoard }}>
            {children}
        </BoardContext.Provider>
    )
}

export default BoardContextProvider