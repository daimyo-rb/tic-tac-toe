function createPlayer (symbol, name) {
    return {name, symbol};
}
const gameboardObj = (() => {
    const fillValue = '·';
    const gameboardLength = 9;
    const gameboard = new Array(gameboardLength).fill(fillValue);
    const getAllValues = () => {
        return gameboard;
    };
    const getValueAtIndex = (index) => {
        return gameboard[index];
    };
    const setValueAtIndex = (index, value) => {
        return gameboard[index] = value;
    };
    const anyMovesRemaining = () => {
        for (let i = 0; i < gameboard.gameboardLength; i++){
            if (gameboard.getValueAtIndex(i) == gameboard.fillValue){
                return false;
            }
        }
        return true;        
    };
    const checkIfIndexUsed = (index) => {
        return (getValueAtIndex(index) == fillValue) ? false : true;
    }
    const resetGameboard = () => {
        gameboard.fill(fillValue);
    };
    const prettyPrintGameboard = () => {
        console.log(`${getValueAtIndex(0)}|${getValueAtIndex(1)}|${getValueAtIndex(2)}`);
        console.log(`${getValueAtIndex(3)}|${getValueAtIndex(4)}|${getValueAtIndex(5)}`);
        console.log(`${getValueAtIndex(4)}|${getValueAtIndex(7)}|${getValueAtIndex(8)}`);
    }
    const printHelperGameboard = () => {
        const helperGameboard = gameboard.map((value, index) => 
            (value == fillValue) ? index : value);
        console.log(`${helperGameboard[0]}|${helperGameboard[1]}|${helperGameboard[2]}`);
        console.log(`${helperGameboard[3]}|${helperGameboard[4]}|${helperGameboard[5]}`);
        console.log(`${helperGameboard[6]}|${helperGameboard[7]}|${helperGameboard[8]}`);
    }
    return {getAllValues, getValueAtIndex, setValueAtIndex, checkIfIndexUsed, anyMovesRemaining, resetGameboard, prettyPrintGameboard, printHelperGameboard};
})();
const gamePlayer = ((gameboard, playerOneSymbol='x', playerOneName = 'Player 1', playerTwoSymbol='o', playerTwoName='Player 2') => {
    const player1 = createPlayer(playerOneSymbol, playerOneName);
    const player2 = createPlayer(playerTwoSymbol, playerTwoName);
    let isPlayer1Turn = true;
    let isGameOver = false;
    const swapWhosTurnIsIt = () => {
        isPlayer1Turn = !isPlayer1Turn;
    };
    const whosTurnIsIt = () => {
        return (isPlayer1Turn) ? player1 : player2;
    };
    const checkTie = () => {
        return (gameboard.anyMovesRemaining) ? false : true;
    };
    const checkTripleIndex = (index1, index2, index3, symbol) => {
        if (gameboard.getValueAtIndex(index1) == symbol && gameboard.getValueAtIndex(index2) == symbol && gameboard.getValueAtIndex(index3) == symbol){
            return true;
        }
        return false;
    };
    const checkPlayerWins = (player) => {
        // 8 win conditions
        if (checkTripleIndex(0,1,2, player.symbol)) return true;
        if (checkTripleIndex(3,4,5, player.symbol)) return true;
        if (checkTripleIndex(6,7,8, player.symbol)) return true;
        if (checkTripleIndex(0,3,6, player.symbol)) return true;
        if (checkTripleIndex(1,4,7, player.symbol)) return true;
        if (checkTripleIndex(2,5,8, player.symbol)) return true;
        if (checkTripleIndex(0,4,8, player.symbol)) return true;
        if (checkTripleIndex(2,4,6, player.symbol)) return true;
        return false;
    };
    const renderGameboard = () => {
        gameboard.printHelperGameboard();
        // gameboard.prettyPrintGameboard();
    };
    const validateMove = (index) => {
        if (gameboard.checkIfIndexUsed(index)) {
            console.log(`${index} already taken by ${gameboard.getValueAtIndex(index)}`);
            renderGameboard();
            return false;
        }
        return true;
    };
    const resetGame = () => {
        console.log("reseting the game");
        isPlayer1Turn = true;
        isGameOver = false;
        gameboard.resetGameboard();
        renderGameboard();
        displayWhosMoveInConsole();
    }
    const displayWhosMoveInConsole = () => {
        let activePlayer = whosTurnIsIt();
        console.log(`${activePlayer.name}, it's your turn! (${activePlayer.symbol})`);
    }
    const handleMove = (index) => {
        if (isGameOver) {
            console.log('game over: reset to play again');
            return;
        }
        let activePlayer = whosTurnIsIt();
        if (!validateMove(index)) return; // validate move
        gameboard.setValueAtIndex(index, activePlayer.symbol); // make move
        if (checkPlayerWins(activePlayer)) { // check victory
            console.log(`${activePlayer.name} wins!`);
            isGameOver = true;
        } else if (checkTie()) { // check tie
            console.log("no remaining moves. It's a Tie!");
            isGameOver = true;
        }
        renderGameboard();
        if (!isGameOver) {
            swapWhosTurnIsIt();
            displayWhosMoveInConsole();
        }   
    }
    return {gameboard, handleMove, resetGame, renderGameboard, displayWhosMoveInConsole};
})(gameboardObj);

gamePlayer.renderGameboard();
gamePlayer.displayWhosMoveInConsole();

// let player1 = createPlayer('x', 'Player 1');
// let player2 = createPlayer('o', 'Player 2');