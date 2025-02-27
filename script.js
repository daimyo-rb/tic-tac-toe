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
const gamePlayerObj = ((gameboard, playerOneSymbol='x', playerOneName = 'Player 1', playerTwoSymbol='o', playerTwoName='Player 2') => {
    const player1 = createPlayer(playerOneSymbol, playerOneName);
    const player2 = createPlayer(playerTwoSymbol, playerTwoName);
    let isPlayer1Turn = true;
    let isGameOver = false;
    let displayString = '';
    const getPlayerName = (player) => {
        return player.name;
    };
    const setPlayerName = (player, name) => {
        player.name = name;
    };
    const getDisplayString = () => {
        return displayString;
    };
    const setDisplayString = (newString) => {
        displayString = newString;
        // console.log(displayString);  
    };
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
        displayString = `${activePlayer.name}, it's your turn! (${activePlayer.symbol})`
        console.log(displayString);
    }
    const handleMove = (index) => {
        if (isGameOver) {
            displayString = 'game over: reset to play again';
            console.log(displayString);
            return;
        }
        let activePlayer = whosTurnIsIt();
        if (!validateMove(index)) return; // validate move
        gameboard.setValueAtIndex(index, activePlayer.symbol); // make move
        if (checkPlayerWins(activePlayer)) { // check victory
            displayString = `${activePlayer.name} wins!`;
            console.log(displayString);
            isGameOver = true;
        } else if (checkTie()) { // check tie
            displayString = "no remaining moves. It's a Tie!"
            console.log(displayString);
            isGameOver = true;
        }
        renderGameboard();
        if (!isGameOver) {
            swapWhosTurnIsIt();
            displayWhosMoveInConsole();
        }   
    }
    renderGameboard();
    displayWhosMoveInConsole();
    
    return {gameboard, handleMove, resetGame, renderGameboard, displayWhosMoveInConsole, getDisplayString, setDisplayString, getPlayerName, setPlayerName, player1, player2};
})(gameboardObj);

const screenController = ((gamePlayer) => {
    const gameDiv = document.getElementById('game-container');
    const gameboard = gamePlayer.gameboard;
    const player1 = gamePlayer.player1;
    const player2 = gamePlayer.player2;
    const logDisplayString = () => {
        console.log(gamePlayer.displayString);
    };
    const isCellEmpty = (index) => {
        return (gameboard.checkIfIndexUsed(index)) ? false : true;
    };
    const createCellFromIndex = (index) => {
        let value = gamePlayer.gameboard.getValueAtIndex(index);
        let cell = document.createElement('button');
        cell.classList.add('cell');
        cell.dataset.index = index;
        if (isCellEmpty(index)){
            cell.innerText = ''
            cell.classList.add('empty');
        } else if (value == player1.symbol) {
            cell.innerText = `${value}`;
            cell.classList.add('player1')
        } else if (value == player2.symbol) {
            cell.innerText = `${value}`;
            cell.classList.add('player2')
        }
        return cell;
    };
    const displayHeader = () => {
        let header = document.createElement('div');
        header.classList.add('game-header');
        let display = document.createElement('p');
        // console.log(gamePlayer.displayString);
        display.innerText = gamePlayer.getDisplayString();
        let resetGameBtn = document.createElement('button');
        resetGameBtn.classList.add('reset-btn');
        resetGameBtn.innerText = 'New Game?';
        header.appendChild(display);
        header.appendChild(resetGameBtn);
        gameDiv.appendChild(header);
    };
    const displayBoard = () => {
        let gameGrid = document.createElement('div');
        gameGrid.classList.add('game-grid');
        gameboard.getAllValues().forEach((value, index) =>{
            // console.log({value, index});
            let tempCell = createCellFromIndex(index);
            gameGrid.appendChild(tempCell);
        });
        gameDiv.appendChild(gameGrid);
    };
    const displayFooter = () => {
        let footerDiv = document.createElement('div');
        footerDiv.classList.add('game-footer');
        [player1, player2].forEach( (player, index) => {
            let playerContainer = document.createElement('div');
            let playerNameElem = document.createElement('p');
            playerNameElem.innerText = `${gamePlayer.getPlayerName(player)}`;
            playerNameElem.dataset.playerId = index;
            let playerSymbolElem = document.createElement('p');
            playerSymbolElem.innerText = `(${player.symbol})`;           
            playerContainer.appendChild(playerNameElem);
            playerContainer.appendChild(playerSymbolElem);
            footerDiv.appendChild(playerContainer);
        });
        gameDiv.appendChild(footerDiv);
    };
    const updateScreen = () => {
        gameDiv.innerText = "";
        displayHeader();
        displayBoard();
        displayFooter();
    };
    function clickHandlerCell(e) {
        // console.log(e.target);
        const selectedCellIndex = e.target.dataset.index;
        if (!selectedCellIndex) return;
        if (e.target.classList.contains('player1')) return;
        if (e.target.classList.contains('player2')) return;
        // at this point click was on open cell; handle move
        gamePlayer.handleMove(selectedCellIndex);
        updateScreen();
    }
    function clickHandlerReset(e) {
        if (e.target.classList.contains('reset-btn')){
            gamePlayer.resetGame();
        }
        updateScreen();
    }
    function updatePlayerName(newPlayerName, player) {
        gamePlayer.setPlayerName(player, newPlayerName);
    }
    function updateDisplayTextOnNewPlayerName(oldPlayerName, newPlayerName){
        let displayText = gamePlayer.getDisplayString();
        if (displayText.includes(oldPlayerName)) {
            let newDisplayString = displayText.replace(oldPlayerName, newPlayerName);
            gamePlayer.setDisplayString(newDisplayString);    
        }
    }
    function handleInputNewPlayerName(inputValue, player) {
        let oldPlayerName = gamePlayer.getPlayerName(player);
        let newPlayerName = inputValue;
        updatePlayerName(newPlayerName, player);
        updateDisplayTextOnNewPlayerName(oldPlayerName,newPlayerName);
        updateScreen();
    }
    function clickHandlerNameChange(e) {
        const selectedPlayerId = e.target.dataset.playerId;
        if (!selectedPlayerId) return;
        let activePlayer = (selectedPlayerId == 0) ? player1 : player2;
        let clickedPlayerNameTag = document.querySelector(`[data-player-id="${selectedPlayerId}"]`);
        const currentContent = clickedPlayerNameTag.textContent;
        const inputTag = document.createElement('input');
        inputTag.type = 'text';
        inputTag.value = currentContent;
        inputTag.classList.add('replace-name-input');
        clickedPlayerNameTag.replaceWith(inputTag);
        inputTag.focus();
        inputTag.addEventListener('blur', () => {
            handleInputNewPlayerName(inputTag.value, activePlayer);
        });
        inputTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleInputNewPlayerName(inputTag.value, activePlayer);
            }
        });
    }
    gameDiv.addEventListener('click',clickHandlerCell);
    gameDiv.addEventListener('click',clickHandlerReset);
    gameDiv.addEventListener('click',clickHandlerNameChange);
    return {displayBoard, logDisplayString, updateScreen};

})(gamePlayerObj);

screenController.updateScreen();

// gamePlayerObj.renderGameboard();
// gamePlayerObj.displayWhosMoveInConsole();

// let player1 = createPlayer('x', 'Player 1');
// let player2 = createPlayer('o', 'Player 2');