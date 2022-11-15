
const cells = document.querySelectorAll('.cell');
const messageField = document.querySelector('#message-field');
const restartButton = document.querySelector('#restart-button');

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
            cells[field].style.backgroundColor = '#555';
            cells[field].style.color = 'white';
        });
    }

    function unmarkAll() {
        cells.forEach(cell => {
            cell.style.backgroundColor = 'white';
            cell.style.color = 'var(--mark-color)';
        })
    }

    return { renderBoard, markFields, unmarkAll };

})();


const game = (function () {

    let gameMode = 'easy';
    let _gameState = 'new_game';
    let player1;
    let player2;
    let moveCounter = 0;
    let winningCombination;
    let playerMark = '0';
    const _winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]

    gameboard.clear();
    _board = gameboard.getBoard();
    player1 = createPlayer('Player1', 'X');
    player2 = createPlayer('Player2', 'O');
    let currentPlayer = player1;
    _gameState = 'make_move';

    if (gameMode !== 'PvP' && playerMark === '0') {
        makeAiMove();
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
            messageField.textContent = `Player ${nextPlayer.mark}'s turn`;

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
        }
    }

})()

function createPlayer(name, mark) {
    mark: mark;
    name: name;

    return { mark, name };

}
