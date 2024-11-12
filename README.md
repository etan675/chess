Simple web based chess game, built with react js and tailwind css

key features/challenges:
- representing chess board data, using 2d array
- implementing rules for the pieces, including castling, logic required intricate array indexing due to needing to know where each piece is on the board
- handling drag and drop events, such as highlighting previous move, adding a border to the square to indicate dropzone, and manipulating board states according to action
- logic for detecting checks, illegal moves, generating and indicating possible moves for each piece during player turn


New possible features: 

detecting checkmate:
- loop through all pieces of the player currently in check, and call getLegalSquares() for each piece, if no legal moves for any piece then it is checkmate

en passant:

pawn promotion:

undo/redo:

integrate castle, pawn promotion, en passant into legal move checks:

some form of persistent storage for game state e.g. local storage or backend: