import { isPlayerPiece } from "./utils";

const pawn = (player, currPos, newPos, board) => {
    const forwardOneRow = player === 'w' ? 
        currPos.row > newPos.row && currPos.row - newPos.row <= 1 : 
        currPos.row < newPos.row && newPos.row - currPos.row  <= 1;

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
            currPos.row > newPos.row && currPos.row - newPos.row <= 2 :
            currPos.row < newPos.row && newPos.row - currPos.row <= 2;

        return (
            (forwardOneOrTwoRows && inStraightLine && isEmptySquare) ||
            canTakePiece
        )
    }

    return (forwardOneRow && inStraightLine && isEmptySquare) || canTakePiece;
}


const rook = (player, currPos, newPos, board) => {
    const vertical = newPos.col === currPos.col && newPos.row !== currPos.row;
    const horizontal = newPos.row === currPos.row && newPos.col !== currPos.col;

    let noObstacleInPath = true;
    
    if (vertical) {
        let smaller = Math.min(currPos.row, newPos.row);
        let bigger = Math.max(currPos.row, newPos.row);

        for (let y = smaller + 1; y < bigger; y++) {
            if (board[y][currPos.col] !== 0) {
                noObstacleInPath = false;
                break;
            }
        }
    } 

    if (horizontal) {
        let smaller = Math.min(currPos.col, newPos.col);
        let bigger = Math.max(currPos.col, newPos.col);

        for (let x = smaller + 1; x < bigger; x++) {
            if (board[currPos.row][x] !== 0) {
                noObstacleInPath = false;
                break;
            }
        }
    }  
    
    const validPath = (vertical || horizontal) && noObstacleInPath
    const validLanding = board[newPos.row][newPos.col] === 0 || !isPlayerPiece(board[newPos.row][newPos.col], player);

    return validPath && validLanding;
}

const bishop = (player, currPos, newPos, board) => {
    const validDiagonal = (
        newPos.row !== currPos.row && 
        newPos.col !== currPos.col &&
        Math.abs(newPos.row - currPos.row) === Math.abs(newPos.col - currPos.col)
    );

    let noObstacleInPath = true;

    if (validDiagonal) {
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
                noObstacleInPath = false;
                break;
            }

            x += xDirection;
        }
    }

    const validPath = validDiagonal && noObstacleInPath;
    const validLanding = board[newPos.row][newPos.col] === 0 || !isPlayerPiece(board[newPos.row][newPos.col], player);
    
    return validPath && validLanding;
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