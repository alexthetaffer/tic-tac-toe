
const cells = document.querySelectorAll('.cell');
const messageField = document.querySelector('#message-field');
const restartButton = document.querySelector('#restart-button');
const playAsXButton = document.querySelector('#play-as-x-button');
const playAs0Button = document.querySelector('#play-as-0-button');
const playerMarkButtons = document.querySelector('.buttons');
const gameModeSelector = document.querySelector('#gameModeSelector');

const gameboard = (function () {
    let _board;

    function clear() {
        _board = [];
        for (let i = 0; i < 9; i++) {
            _board.push('');
        }
    }

    function getBoard() {
        return _board;
    }

    function markCell(i, mark) {
        _board[i] = mark;
    }

    return {
        clear, getBoard, markCell
    }
})();

const displayController = (function () {

    function renderBoard() {
        const board = gameboard.getBoard();
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = board[i];
        }
    };

    function markFields(fields) {
        fields.forEach(field => {
            cells[field].style.color = 'var(--winner-color)';
        });
    }

    function unmarkAll() {
        cells.forEach(cell => {
            cell.style.color = 'var(--mark-color)';
        })
    }

    return { renderBoard, markFields, unmarkAll };

})();


const game = (function () {

    let gameMode = 'simpleAI';
    let _gameState = 'new_game';
    let player1 = createPlayer('Player1', 'X');
    let player2 = createPlayer('Player2', 'O');
    let moveCounter = 0;
    let winningCombination;
    let playerMark = 'X';
    const _winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]

    restartGame();

    if (gameMode !== 'PvP' && playerMark === '0') {
        makeAiMove();
    }

    function restartGame() {
        _gameState = "make_move";
        moveCounter = 0;
        currentPlayer = player1;
        messageField.textContent = `Player ${currentPlayer.mark}'s turn`;
        gameboard.clear();
        _board = gameboard.getBoard();
        displayController.renderBoard();
        displayController.unmarkAll();
        if (gameMode !== 'PvP' && playerMark === '0') {
            makeAiMove();
        }
        if (gameMode !== 'PvP') {
            messageField.textContent = `Make a move`;

        }
    }

    function makeAiMove() {
        const possibleMoves = [];
        for (let i = 0; i < 9; i++) {
            if (validateMove(i)) {
                possibleMoves.push(i);
            }
        }
        const move = possibleMoves[Math.floor(Math.random() * (possibleMoves.length))];
        gameboard.markCell(move, currentPlayer.mark);
        displayController.renderBoard();
        moveCounter++;
        if (checkWinner(currentPlayer)) {
            _gameState = 'end_game';
            messageField.textContent = `${currentPlayer.mark} is a winner!`;
            displayController.markFields(winningCombination);
        }
        if (moveCounter === 9 && !checkWinner(currentPlayer)) {
            messageField.textContent = `It's a tie!`;
            return;
        }
        changePlayer();

    }

    function changePlayer() {
        currentPlayer = (currentPlayer.name == 'Player1') ? player2 : player1;
    }

    function validateMove(i) {
        if (_board[i] === '') {
            return true;
        } else {
            return false;
        }
    }

    function checkWinner(player) {
        const board = gameboard.getBoard();
        const mark = player.mark;

        for (let i = 0; i < _winningCombinations.length; i++) {
            const comb = _winningCombinations[i];
            if (board[comb[0]] == mark
                && board[comb[1]] == mark
                && board[comb[2]] == mark) {
                winningCombination = comb;
                return true;
            }
        }
        return false;
    }


    for (let i = 0; i < 9; i++) {
        cells[i].addEventListener('click', () => {
            if (_gameState !== 'make_move') return;
            const nextPlayer = (currentPlayer.name === 'Player1') ? player2 : player1;
            if (gameMode === 'PvP') {
                messageField.textContent = `Player ${nextPlayer.mark}'s turn`;
            }

            if (validateMove(i)) {
                gameboard.markCell(i, currentPlayer.mark);
                displayController.renderBoard();
                moveCounter++;
                if (checkWinner(currentPlayer)) {
                    _gameState = 'end_game';
                    messageField.textContent = `${currentPlayer.mark} is a winner!`;
                    displayController.markFields(winningCombination);
                    return;
                }
                if (moveCounter === 9 && !checkWinner(currentPlayer)) {
                    messageField.textContent = `It's a tie!`;
                    return;
                }
                changePlayer();
                if (gameMode !== "PvP") makeAiMove();
            }
        });

        restartButton.onclick = restartGame;
        playAsXButton.addEventListener('click', () => {
            if(playerMark === 'X') return;
            playerMark = 'X';
            playAsXButton.classList.add('active');
            playAs0Button.classList.remove('active');
            restartGame();
        })
        playAs0Button.addEventListener('click', () => {
            if(playerMark === '0') return;
            playerMark = '0';
            playAs0Button.classList.add('active');
            playAsXButton.classList.remove('active');
            restartGame();
        })
        gameModeSelector.onchange = function() {
            if (gameModeSelector.value === 'PvP') {
                gameMode = 'PvP';
                playerMarkButtons.style.visibility = 'hidden';
                restartGame();
            } else if (gameModeSelector.value === 'simpleAI') {
                gameMode = 'simpleAI';
                playerMarkButtons.style.visibility = 'visible';
                restartGame();
            };
        }
    }

})()

function createPlayer(name, mark) {
    mark: mark;
    name: name;

    return { mark, name };

}
