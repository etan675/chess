import { ReactComponent as WhiteKing } from "./images/pieceIcons/king_white.svg";
import { ReactComponent as WhiteQueen } from "./images/pieceIcons/queen_white.svg";
import { ReactComponent as WhiteRook } from "./images/pieceIcons/rook_white.svg";
import { ReactComponent as WhiteKnight } from "./images/pieceIcons/knight_white.svg";
import { ReactComponent as WhiteBishop } from "./images/pieceIcons/bishop_white.svg";
import { ReactComponent as WhitePawn } from "./images/pieceIcons/pawn_white.svg";
import { ReactComponent as BlackKing } from "./images/pieceIcons/king_black.svg";
import { ReactComponent as BlackQueen } from "./images/pieceIcons/queen_black.svg";
import { ReactComponent as BlackRook } from "./images/pieceIcons/rook_black.svg";
import { ReactComponent as BlackKnight } from "./images/pieceIcons/knight_black.svg";
import { ReactComponent as BlackBishop } from "./images/pieceIcons/bishop_black.svg";
import { ReactComponent as BlackPawn } from "./images/pieceIcons/pawn_black.svg";

const WHITE_PAWN = 1;
const WHITE_BISHOP = 2;
const WHITE_KNIGHT = 3;
const WHITE_ROOK = 4;
const WHITE_QUEEN = 5;
const WHITE_KING = 6;
const BLACK_PAWN = 7;
const BLACK_BISHOP = 8;
const BLACK_KNIGHT = 9;
const BLACK_ROOK = 10;
const BLACK_QUEEN = 11;
const BLACK_KING = 12;

const PIECE_ICONS = {
    [WHITE_PAWN]: <WhitePawn />,
    [WHITE_BISHOP]: <WhiteBishop />,
    [WHITE_KNIGHT]: <WhiteKnight />,
    [WHITE_ROOK]: <WhiteRook />,
    [WHITE_QUEEN]: <WhiteQueen />,
    [WHITE_KING]: <WhiteKing />,
    [BLACK_PAWN]: <BlackPawn />,
    [BLACK_BISHOP]: <BlackBishop />,
    [BLACK_KNIGHT]: <BlackKnight />,
    [BLACK_ROOK]: <BlackRook />,
    [BLACK_QUEEN]: <BlackQueen />,
    [BLACK_KING]: <BlackKing />,
};

const BOARD_STATE_KEY = 'boardState';
const PLAYER_MOVE_KEY = 'currentMove';
const WHITE_PIECES_TAKEN_KEY = 'whitePiecesTaken';
const BLACK_PIECES_TAKEN_KEY = 'blackPiecesTaken';

export {
    // piece ids
    WHITE_PAWN,
    WHITE_BISHOP,
    WHITE_KNIGHT,
    WHITE_ROOK,
    WHITE_QUEEN,
    WHITE_KING,
    BLACK_PAWN,
    BLACK_BISHOP,
    BLACK_KNIGHT,
    BLACK_ROOK,
    BLACK_QUEEN,
    BLACK_KING,
    // piece icons
    PIECE_ICONS,
    // local storage keys
    BOARD_STATE_KEY,
    PLAYER_MOVE_KEY,
    WHITE_PIECES_TAKEN_KEY,
    BLACK_PIECES_TAKEN_KEY,
}