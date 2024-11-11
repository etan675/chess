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

const isValidMove = (pieceId, currPos, newPos, board) => {
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
            }
        })
    })

    return foundPosition;
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

export {
    isPlayerPiece,
    isValidMove,
    getPiecePosition,
    isHorizontalPathClear,
    isVerticalPathClear,
    isDiagonalPathClear
}
