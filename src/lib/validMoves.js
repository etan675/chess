import { isDiagonalPathClear, isHorizontalPathClear, isPlayerPiece, isVerticalPathClear } from "./utils";

const pawn = (player, currPos, newPos, board) => {
    const forwardOneRow = player === 'w' ?
        currPos.row - newPos.row === 1 :
        newPos.row - currPos.row === 1;

    const inStraightLine = newPos.col === currPos.col;

    const isEmptySquare = board[newPos.row][newPos.col] === 0;

    const canTakePiece = (
        !isEmptySquare &&
        !isPlayerPiece(board[newPos.row][newPos.col], player) &&
        forwardOneRow &&
        Math.abs(newPos.col - currPos.col) === 1
    );

    const startRow = player === 'w' ? 6 : 1;

    if (currPos.row === startRow) {
        const forwardOneOrTwoRows = player === 'w' ?
            currPos.row - newPos.row === 1 || currPos.row - newPos.row === 2 :
            newPos.row - currPos.row === 1 || newPos.row - currPos.row === 2;

        return (
            (forwardOneOrTwoRows && inStraightLine && isEmptySquare) ||
            canTakePiece
        )
    }

    return (forwardOneRow && inStraightLine && isEmptySquare) || canTakePiece;
}

const rook = (player, currPos, newPos, board) => {
    let validVerticalPath = isVerticalPathClear(currPos, newPos, board);
    let validHorizontalPath = isHorizontalPathClear(currPos, newPos, board);

    const validPath = validVerticalPath || validHorizontalPath;
    const validLanding = board[newPos.row][newPos.col] === 0 || !isPlayerPiece(board[newPos.row][newPos.col], player);

    return validPath && validLanding;
}

const bishop = (player, currPos, newPos, board) => {
    let validDiagonalPath = isDiagonalPathClear(currPos, newPos, board);
    const validLanding = board[newPos.row][newPos.col] === 0 || !isPlayerPiece(board[newPos.row][newPos.col], player);

    return validDiagonalPath && validLanding;
}

const knight = (player, currPos, newPos, board) => {
    const yDistance = Math.abs(newPos.row - currPos.row);
    const xDistance = Math.abs(newPos.col - currPos.col);

    const validJump = (
        (yDistance === 1 || yDistance === 2) &&
        (xDistance === 1 || xDistance === 2) &&
        yDistance + xDistance === 3
    );

    const validLanding = board[newPos.row][newPos.col] === 0 || !isPlayerPiece(board[newPos.row][newPos.col], player);

    return validJump && validLanding;
}

const queen = (player, currPos, newPos, board) => {
    return bishop(player, currPos, newPos, board) || rook(player, currPos, newPos, board);
}

const king = (player, currPos, newPos, board) => {
    const moveOneSquare = Math.abs(newPos.row - currPos.row) <= 1 && Math.abs(newPos.col - currPos.col) <= 1;
    const validLanding = board[newPos.row][newPos.col] === 0 || !isPlayerPiece(board[newPos.row][newPos.col], player);

    return moveOneSquare && validLanding;
}

export {
    pawn,
    rook,
    bishop,
    knight,
    queen,
    king
};