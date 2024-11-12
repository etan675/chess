Simple web based chess game, built with react js and tailwind css.

Key features/challenges:

Logic for how pieces move:

- Coding how every piece should interact with the board, implementation often required intricate array indexing due to needing to know where each piece is on the board and whether they are obstructed the other pieces.

Logic for detecting game state:

- This included detecting checks, pieces under attack, illegal moves, and generating 
all possible moves in a position to detect checkmate.

Drag and drop:

- Handling nice UI features like highlighting previous move, indicating valid drop zones for each square when a piece is dragged over it, and showing possible moves for a piece after it is picked up.


TODO: 

optimise detecting checkmate: since we sometimes check for checkmate before their turn anyway, we might as well call isCheckMate() first in those cases, since it generates ALL the legal squares for every move for that turn. We can then use that information when the player goes to make their move.

pawn promotion:

en passant:

undo/redo:

integrate castle, pawn promotion, en passant into legal move checks:

some form of persistent storage for game state e.g. local storage or backend: