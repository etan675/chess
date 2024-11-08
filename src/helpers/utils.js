import { bishop, king, knight, pawn, queen, rook } from "./validMoves";

const isPlayerPiece = (pieceId, player) => {
    if (player === 'w') {
        return pieceId > 0 && pieceId <= 6;
    }

    if (player === 'b') {
        return pieceId >= 7 && pieceId <= 12;
    }
}

const isValidMove = (pieceId, currPos, newPos, board) => {
    if (currPos.row === newPos.row && currPos.col === newPos.col) {
        return false;
    }

    switch (pieceId) {
        case (1):            
            return pawn('w', currPos, newPos, board);
        case (7):
            return pawn('b', currPos, newPos, board);
        case (4): 
            return rook('w', currPos, newPos, board);
        case (10):
            return rook('b', currPos, newPos, board);
        case (2):
            return bishop('w', currPos, newPos, board);
        case (8):
            return bishop('b', currPos, newPos, board);
        case (3):
            return knight('w', currPos, newPos, board);
        case (9):
            return knight('b', currPos, newPos, board);
        case (5):
            return queen('w', currPos, newPos, board);
        case (11):
            return queen('b', currPos, newPos, board);
        case (6):
            return king('w', currPos, newPos, board);
        case (12):
            return king('b', currPos, newPos, board);
        default:
            return true;
    }
}

export {
    isPlayerPiece,
    isValidMove
}
