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
    const board = Gameboard.getBoard();
    const currentPlayerDisplay = document.querySelector(".playerTurn");
    const parentDiv = document.querySelector(".cell").parentElement;
    const cells = document.querySelectorAll(".cell");

    const updateDOM = function () {
        for (let i = 0; i < board.length; i++) {
            cells[i].textContent = board[i];
        }
    };

    const updatePlayerDisplay = function (name, marker) {
        if (!currentPlayerDisplay) return;
        currentPlayerDisplay.textContent = `${name} (${marker})`;
    };

    let listenersAttached = false;

    const render = function () {
        const dialog = document.querySelector("dialog");
        const playerOne = document.querySelector("#playerOne");
        const playerTwo = document.querySelector("#playerTwo");

        if (listenersAttached) return;
        cells.forEach((cell) => {
            cell.addEventListener("click", function () {
                GameController.setMarker(
                    Array.from(parentDiv.children).indexOf(cell)
                );
                GameController.winningChecks(cells);
                updatePlayerDisplay(
                    GameController.getCurrentPlayer().getName(),
                    GameController.getCurrentPlayer().getMarker()
                );
            });
        });
        listenersAttached = true;
    };

    return { updateDOM, render, updatePlayerDisplay };
})();

const GameController = (function () {
    let playerOne = null;
    let playerTwo = null;
    const board = Gameboard.getBoard();
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

    let currentPlayer = null;
    let gameOver = false;

    const getCurrentPlayer = () => currentPlayer;

    const playersInitialized = () => playerOne !== null && playerTwo !== null;

    const initPlayers = function (nameOne, nameTwo) {
        const p1Name = nameOne && nameOne.trim() ? nameOne.trim() : "Player 1";
        const p2Name = nameTwo && nameTwo.trim() ? nameTwo.trim() : "Player 2";
        playerOne = Player(p1Name, "X");
        playerTwo = Player(p2Name, "0");
        currentPlayer = playerOne;
    };

    const switchPlayer = () => {
        if (!playersInitialized()) return;
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    const setMarker = function (index) {
        if (!playersInitialized()) return;
        if (gameOver) return;
        if (board[index] !== "") return;

        Gameboard.setCell(index, currentPlayer.getMarker());
        DisplayController.updateDOM();
    };

    const winningChecks = function (cellsDOM, winningCells = []) {
        if (!playersInitialized()) return;
        const isWin = possibleWins.some((arr) => {
            if (arr.every((i) => board[i] === currentPlayer.getMarker())) {
                winningCells = arr;
                return true;
            }
        });

        if (isWin) {
            gameOver = true;
            Gameboard.reset();
            winningCells.forEach((i) => cellsDOM[i].classList.add("winner"));

            return;
        }

        if (board.every((cell) => cell !== "")) {
            gameOver = true;
            return;
        }

        switchPlayer();
    };

    const reset = function () {
        currentPlayer = playerOne;
        board.fill("");
        DisplayController.updateDOM();
        gameOver = false;
    };

    return { getCurrentPlayer, initPlayers, setMarker, winningChecks, reset };
})();

document.querySelector(".start").addEventListener("click", function () {
    const dialog = document.querySelector("#playerDialog");
    if (dialog) dialog.showModal();
});

document.querySelector(".reset").addEventListener("click", function () {
    GameController.reset();
    document
        .querySelectorAll(".cell")
        .forEach((cell) => cell.classList.remove("winner"));
    DisplayController.updatePlayerDisplay(
        GameController.getCurrentPlayer().getName(),
        GameController.getCurrentPlayer().getMarker()
    );
});

const playerDialog = document.querySelector("#playerDialog");
if (playerDialog) {
    const playerForm = playerDialog.querySelector("form");
    if (playerForm) {
        playerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameOne = document.querySelector("#playerOne").value || "";
            const nameTwo = document.querySelector("#playerTwo").value || "";

            const trimmedOne = nameOne.trim();
            const trimmedTwo = nameTwo.trim();

            if (!trimmedOne || !trimmedTwo) {
                alert("Please enter names for both players.");
                return;
            }

            if (trimmedOne === trimmedTwo) {
                alert("Please enter different names for each player.");
                return;
            }

            GameController.initPlayers(trimmedOne, trimmedTwo);
            playerDialog.close();
            DisplayController.render();
            DisplayController.updatePlayerDisplay(
                GameController.getCurrentPlayer().getName(),
                GameController.getCurrentPlayer().getMarker()
            );
        });
    }
}
