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

export {
    isPlayerPiece,
    isValidMove
}
