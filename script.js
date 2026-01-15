const Gameboard = (function () {
    const board = Array(9).fill("");
    const getBoard = () => board;
    const setCell = (index, marker) => (board[index] = marker);
    const reset = () => board.fill("");

    return { getBoard, setCell, reset };
})();

const Player = function (name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
};

const DisplayController = (function () {
    let board = Gameboard.getBoard();
    let cells = document.querySelectorAll(".cell");

    const updateDOM = function () {
        for (let i = 0; i < board.length; i++) {
            cells[i].textContent = board[i];
        }
    };

    return { updateDOM };
})();

const GameController = (function () {
    const player1 = Player("Lawson", "X");
    const player2 = Player("Some guy", "0");

    let board = Gameboard.getBoard();
    let cells = document.querySelectorAll(".cell");
    const possibleWins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let currentPlayer = player1;
    const switchPlayer = () =>
        (currentPlayer = currentPlayer === player1 ? player2 : player1);

    let gameOver = false;
    const playRound = function () {
        cells.forEach((cell) =>
            cell.addEventListener("click", function () {
                if (gameOver) return;

                    let index = Array.from(cell.parentElement.children).indexOf(cell);
                    if (board[index] !== "") return;

                    Gameboard.setCell(index, currentPlayer.getMarker());
                    DisplayController.updateDOM();

                    let winningCells = [];

                    const isWin = possibleWins.some((arr) => {
                        if (
                            arr.every(
                                (i) => board[i] === currentPlayer.getMarker()
                            )
                        ) {
                            winningCells = arr;
                            return true;
                        }
                    });

                    if (isWin) {
                        gameOver = true;
                        Gameboard.reset();
                        winningCells.forEach(
                            (i) => (cells[i].style.background = "red")
                        );

                        return;
                    }

                    if (board.every((cell) => cell !== "")) {
                        gameOver = true;
                        return;
                    }

                    switchPlayer();
                
            })
        );
    };

    return { playRound };
})();

GameController.playRound();
