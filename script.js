
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
    let currentPlayer = 'player1';
    let player1;
    let player2;
    let moveCounter = 0;
    const _winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]
    

    const startNewGame = function() {
        moveCounter = 0;
        gameboard.clear();
        player1 = createPlayer('Player1', 'X');
        player2 = createPlayer('Player2', '0');
        _gameState = 'make_move';
        currentPlayer = 'player1';
        

        for (let i = 0; i < 9; i++) {
            cells[i].addEventListener('click', () => {
                if(_gameState !== 'make_move') return;
                let player = (currentPlayer == 'player1') ? player1 : player2;
                
                if (validateMove(i)) {
                    gameboard.markCell(i, player.mark);
                    displayController.renderBoard();
                    moveCounter++;
                    if (checkWinner(player)) {
                        _gameState = 'end_game';
                        messageField.textContent = `${player.mark} is a winner!`;
                    }
                    if (moveCounter === 9 && !checkWinner(player)) {
                        console.log(`It's a tie!`);
                        messageField.textContent = `It's a tie!`;
                    }
                    changePlayer();
                }
            });
    }

        function changePlayer() {
            if (currentPlayer === 'player1') {
                currentPlayer = 'player2';
            } else {
                currentPlayer = 'player1';
            }
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
                        return true;
                    }
            }
            return false;
        }
        
    }

    function restartGame() {
        _gameState = "make_move";
        moveCounter = 0;
        gameboard.clear();
        player1 = createPlayer('Player1', 'X');
        player2 = createPlayer('Player2', '0');
        _gameState = 'make_move';
        currentPlayer = 'player1';
        _board = gameboard.getBoard();
    }
    return {startNewGame, restartGame};

})()

const displayController = (function() {

    function renderBoard() {
        const board = gameboard.getBoard();
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = board[i];
        }
    };

    return {renderBoard};

})();


function createPlayer(name, mark) {
    mark: mark;
    name: name;

    return {mark, name};
    
}

game.startNewGame();

restartButton.onclick = game.restartGame();

