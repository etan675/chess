import { BLACK_BISHOP, BLACK_KING, BLACK_KNIGHT, BLACK_PAWN, BLACK_QUEEN, BLACK_ROOK, WHITE_BISHOP, WHITE_KING, WHITE_KNIGHT, WHITE_PAWN, WHITE_QUEEN, WHITE_ROOK } from "../constants";
import { bishop, king, knight, pawn, queen, rook } from "./validMoves";

const isPlayerPiece = (pieceId, player) => {
    if (player === 'w') {
        return pieceId >= WHITE_PAWN && pieceId <= WHITE_KING;
    }

    if (player === 'b') {
        return pieceId >= BLACK_PAWN && pieceId <= BLACK_KING;
    }
}

// checks whether a move is valid based only on the piece mechanics, 
// does not account for checks or checkmate
const isValidMoveNaive = (pieceId, currPos, newPos, board) => {
    if (currPos.row === newPos.row && currPos.col === newPos.col) {
        return false;
    }

    switch (pieceId) {
        case (WHITE_PAWN):                      
            return pawn('w', currPos, newPos, board);
        case (BLACK_PAWN):
            return pawn('b', currPos, newPos, board);
        case (WHITE_BISHOP):
            return bishop('w', currPos, newPos, board);
        case (BLACK_BISHOP):
            return bishop('b', currPos, newPos, board);
        case (WHITE_KNIGHT):
            return knight('w', currPos, newPos, board);
        case (BLACK_KNIGHT):
            return knight('b', currPos, newPos, board);
        case (WHITE_ROOK): 
            return rook('w', currPos, newPos, board);
        case (BLACK_ROOK):
            return rook('b', currPos, newPos, board);
        case (WHITE_QUEEN):
            return queen('w', currPos, newPos, board);
        case (BLACK_QUEEN):
            return queen('b', currPos, newPos, board);
        case (WHITE_KING):
            return king('w', currPos, newPos, board);
        case (BLACK_KING):
            return king('b', currPos, newPos, board);
        default:
            return false;
    }
}

const getPiecePosition = (pieceId, board) => {
    const foundPosition = { row: -1, col: -1 };

    board.some((row, rowIndex) => {
        return row.some((_pieceId, colIndex) => {
            if (_pieceId === pieceId) {
                foundPosition.row = rowIndex;
                foundPosition.col = colIndex;

                return true;
            }

            return false;
        })
    })

    return foundPosition;
}

const getKingPosition = (player, board) => {
    const pieceId = player === 'w' ? WHITE_KING : BLACK_KING;

    return getPiecePosition(pieceId, board);
}

const isHorizontalPathClear = (currPos, targetPos, board) => {
    const validHorizontal = targetPos.row === currPos.row && targetPos.col !== currPos.col;

    if (!validHorizontal) {
        return false;
    }

    let smallerX = Math.min(currPos.col, targetPos.col);
    let biggerX = Math.max(currPos.col, targetPos.col);

    for (let x = smallerX + 1; x < biggerX; x++) {
        if (board[currPos.row][x] !== 0) {
            return false;
        }
    }

    return true;
}

const isVerticalPathClear = (currPos, targetPos, board) => {
    const validVertical = targetPos.col === currPos.col && targetPos.row !== currPos.row;

    if (!validVertical) {
        return false;
    }

    let smallerY = Math.min(currPos.row, targetPos.row);
    let biggerY = Math.max(currPos.row, targetPos.row);

    for (let y = smallerY + 1; y < biggerY; y++) {
        if (board[y][currPos.col] !== 0) {
            return false;
        }
    }

    return true;
}

const isDiagonalPathClear = (currPos, newPos, board) => {
    const validDiagonal = (
        newPos.row !== currPos.row &&
        newPos.col !== currPos.col &&
        Math.abs(newPos.row - currPos.row) === Math.abs(newPos.col - currPos.col)
    );

    if (!validDiagonal) {
        return false;
    }

    let smallerY = Math.min(currPos.row, newPos.row);
    let biggerY = Math.max(currPos.row, newPos.row);
    let startX;
    let endX;
    let xDirection;

    if (smallerY === currPos.row) {
        startX = currPos.col;
        endX = newPos.col;

    } else if (smallerY === newPos.row) {
        startX = newPos.col;
        endX = currPos.col;
    }

    xDirection = startX < endX ? 1 : -1;

    let x = startX + xDirection;

    for (let y = smallerY + 1; y < biggerY; y++) {
        if (board[y][x] !== 0) {
            return false;
        }

        x += xDirection;
    }

    return true;
}

const isInCheck = (player, board) => {
    const kingPos = getKingPosition(player, board);

    // check whether any enemy pieces are attacking our king
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const currPieceId = board[i][j];
            const currPos = { row: i, col: j };
            
            if (!isPlayerPiece(currPieceId, player)) {
                if (isValidMoveNaive(currPieceId, currPos, kingPos, board)) {
                    return true;
                }
            }
        }
    }

    return false;
}

// a move is legal if it is a valid move according to the piece rules, 
// and the player is not put in check after the move
const isLegalMove = (player, pieceId, currPos, newPos, board) => {
    if (!isValidMoveNaive(pieceId, currPos, newPos, board)) {
        return false;
    }

    const newBoard = board.map(row => [...row]);

    // simulate the new board state
    newBoard[currPos.row][currPos.col] = 0;
    newBoard[newPos.row][newPos.col] = pieceId;

    return !isInCheck(player, newBoard);
}

const getCastledBoard = (player, side, board) => {
    const newBoard = board.map(row => [...row]);

    if (player === 'b') {
        if (side === 'k') {
            newBoard[0][4] = 0;
            newBoard[0][6] = BLACK_KING;
            newBoard[0][7] = 0;
            newBoard[0][5] = BLACK_ROOK;

        } else if (side === 'q') {
            newBoard[0][4] = 0;
            newBoard[0][2] = BLACK_KING;
            newBoard[0][0] = 0;
            newBoard[0][3] = BLACK_ROOK;
        }
    } else if (player === 'w') {
        if (side === 'k') {
            newBoard[7][4] = 0;
            newBoard[7][6] = WHITE_KING;
            newBoard[7][7] = 0;
            newBoard[7][5] = WHITE_ROOK;

        } else if (side === 'q') {
            newBoard[7][4] = 0;
            newBoard[7][2] = WHITE_KING;
            newBoard[7][0] = 0;
            newBoard[7][3] = WHITE_ROOK;
        }
    }

    return newBoard;
}

const isLegalCastle = (player, side, board) => {
    // simulate new board state after the castle
    const newBoard = getCastledBoard(player, side, board);

    return !isInCheck(player, newBoard);
}

const getLegalSquares = (player, pieceId, currPos, board) => {
    const legalMoves = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const newPos = { row: i, col: j };

            if (isLegalMove(player, pieceId, currPos, newPos, board)) {
                legalMoves.push(newPos);
            }
        }
    }

    return legalMoves;
}

const isCheckMate = (player, board) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const currPieceId = board[i][j];

            if (isPlayerPiece(currPieceId, player)) {
                const currPos = { row: i, col: j };

                const legalSquares = getLegalSquares(player, currPieceId, currPos, board);

                if (legalSquares.length) {
                    return false;
                }
            }
        }
    }

    return true;
}

const isKingsideCastleAttempt = (player, draggedPieceId, currPos, newPos) => {
    // if a player drags their king more than one square horizontally, it is considered a castle attempt

    return (
        ((player === 'w' && draggedPieceId === WHITE_KING) || (player === 'b' && draggedPieceId === BLACK_KING)) &&
        currPos.row === newPos.row &&
        newPos.col - currPos.col > 1
    );
}

const isQueensideCastleAttempt = (player, draggedPieceId, currPos, newPos) => {
    // if a player drags their king more than one square horizontally, it is considered a castle attempt

    return (
        ((player === 'w' && draggedPieceId === WHITE_KING) || (player === 'b' && draggedPieceId === BLACK_KING)) &&
        currPos.row === newPos.row &&
        currPos.col - newPos.col > 1
    );
}


export {
    isPlayerPiece,
    isHorizontalPathClear,
    isVerticalPathClear,
    isDiagonalPathClear,
    isInCheck,
    isLegalMove,
    isLegalCastle,
    isKingsideCastleAttempt,
    isQueensideCastleAttempt,
    getLegalSquares,
    isCheckMate
}
