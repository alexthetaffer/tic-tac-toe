
let playerMark = 'X';
let gameMode = 'PvP';
const cells = document.querySelectorAll('.cell');
const messageField = document.querySelector('#message-field');
const restartButton = document.querySelector('#restart-button');

const gameboard = (function() {
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

const game = (function() {
    let _gameState = 'new_game';
    let player1;
    let player2;
    let moveCounter = 0;
    let winningCombination;
    const _winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]
    

    const startNewGame = function() {
        gameboard.clear();
        _board = gameboard.getBoard();
        player1 = createPlayer('Player1', 'X');
        player2 = createPlayer('Player2', '0');
        let currentPlayer = player1;
        _gameState = 'make_move';


        for (let i = 0; i < 9; i++) {
            cells[i].addEventListener('click', () => {
                if(_gameState !== 'make_move') return;
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
                    }
                    if (moveCounter === 9 && !checkWinner(currentPlayer)) {
                        console.log(`It's a tie!`);
                        messageField.textContent = `It's a tie!`;
                    }
                    changePlayer();
                }
            });
    }

    restartButton.onclick = restartGame;

        function changePlayer() {
            currentPlayer = (currentPlayer.name == 'Player1') ? player2 : player1;
        }

        function validateMove(i) {
            console.log(_board[i])
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
        
        function restartGame() {
            _gameState = "make_move";
            moveCounter = 0;
            currentPlayer = player1;
            messageField.textContent = `Player ${currentPlayer.mark}'s turn`;
            gameboard.clear();
            _board = gameboard.getBoard();
            displayController.renderBoard();
            displayController.unmarkAll();
        }
    }

    return {startNewGame};

})()

const displayController = (function() {

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

    return {renderBoard, markFields, unmarkAll};

})();


function createPlayer(name, mark) {
    mark: mark;
    name: name;

    return {mark, name};
    
}

game.startNewGame();
