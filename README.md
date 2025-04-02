Play chess in the browser!

Live app:

https://etan675.github.io/chess

Tech stack:

- JavaScript, React, Tailwind CSS

Features:

- Full game mechanics implemented 
- Detects all possible moves when you pick up a piece, as well as which enemy pieces you can take with it
- Indicates the last move made by highlighted positions on the board
- Game state saved in browser's session storage, persists as long as browser is open
- Stores a full history of the game's moves, allowing undo and redo of player moves, game state management implemented using useReducer hook with custom actions
