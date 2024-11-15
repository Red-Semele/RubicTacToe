const cube = document.getElementById('cube');
let rotationX = 0; // Initial rotation on X-axis
let rotationY = 0; // Initial rotation on Y-axis
let tempBack = ""
let trueBackLayer = ""
let xTotalWins = 0; // Total wins for player X
let oTotalWins = 0; // Total wins for player O
let delayedWin = false
let winRequirement = 2
let tickTackToePlayer = ""
let rubixCubeSolver = ""

const faceColors = {
    front: 'red',
    back: 'blue',
    left: 'green',
    right: 'yellow',
    top: 'orange',
    bottom: 'purple'
};





// Function to rotate the entire cube with arrow keys
function rotateCube(deltaX, deltaY) {
    rotationX += deltaX;
    rotationY += deltaY;
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

// Event listener for arrow keys
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            rotateCube(0, -10); // Rotate left
            break;
        case 'ArrowRight':
            rotateCube(0, 10); // Rotate right
            break;
        case 'ArrowUp':
            rotateCube(-10, 0); // Rotate up
            break;
        case 'ArrowDown':
            rotateCube(10, 0); // Rotate down
            break;
        case 'Shift':
            toggleDebug(true); // Enable debug mode
            break;
        case 'r':
            resetCubeRotation();
            break;
        case 'u':
            // Listen for 'u' key press to trigger undo
            undoLastMove();
            break;
            
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') {
        toggleDebug(false); // Disable debug mode
    }
});

function rotateRow(rowIndex) {
    const layers = getRowLayers(rowIndex);
    console.log("Pug" + rowIndex)
    rotateLayers(layers, 'row', rowIndex);
}

function rotateColumn(colIndex) {
    
    const layers = getColumnLayers(colIndex);
    rotateLayers(layers, 'column', colIndex);
    
}

function toggleDebug(isDebug) {
    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    
    faces.forEach(faceName => {
        const faceBlocks = document.querySelectorAll(`.${faceName} .block`);
        faceBlocks.forEach((block, index) => {
            if (isDebug) {
                // Display index relative to the face (0-8 layout)
                block.innerText = index;
                block.classList.add('debug'); // Add debug style
            } else {
                block.innerText = ''; // Clear index display
                block.classList.remove('debug'); // Remove debug style
            }
        });
    });
}

// Modify key event to activate only with Shift + X
document.addEventListener('keydown', (event) => {
    if (event.key === 'X' && event.shiftKey) {
        toggleDebug(true); // Enable debug mode when Shift + X is pressed
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'X' && event.shiftKey) {
        toggleDebug(false); // Disable debug mode when Shift + X is released
    }
});

function getRowLayers(rowIndex) {
    const frontLayer = Array.from(document.querySelectorAll('.front .block')).slice(rowIndex * 3, rowIndex * 3 + 3);
    const backLayer = Array.from(document.querySelectorAll('.back .block')).slice(rowIndex * 3, rowIndex * 3 + 3);
    const leftLayer = Array.from(document.querySelectorAll('.left .block')).slice(rowIndex * 3, rowIndex * 3 + 3);
    const rightLayer = Array.from(document.querySelectorAll('.right .block')).slice(rowIndex * 3, rowIndex * 3 + 3);
    const topLayer = Array.from(document.querySelectorAll('.top .block')).slice(rowIndex * 3, rowIndex * 3 + 3);
    const bottomLayer = Array.from(document.querySelectorAll('.bottom .block')).slice(rowIndex * 3, rowIndex * 3 + 3);
    return { frontLayer, backLayer, leftLayer, rightLayer, topLayer, bottomLayer };
}

function getColumnLayers(colIndex) {
    // Adjust the backLayer column index based on the specified rules
    const adjustedBackColIndex = colIndex === 0 ? 2 : (colIndex === 2 ? 0 : colIndex);

    const frontLayer = [
        document.querySelector(`.front .block:nth-child(${colIndex + 1})`),
        document.querySelector(`.front .block:nth-child(${colIndex + 4})`),
        document.querySelector(`.front .block:nth-child(${colIndex + 7})`)
    ];
    
    const backLayer = [
        document.querySelector(`.back .block:nth-child(${adjustedBackColIndex + 1})`),
        document.querySelector(`.back .block:nth-child(${adjustedBackColIndex + 4})`),
        document.querySelector(`.back .block:nth-child(${adjustedBackColIndex + 7})`)
    ];

    const leftLayer = [
        document.querySelector(`.left .block:nth-child(${colIndex + 1})`),
        document.querySelector(`.left .block:nth-child(${colIndex + 4})`),
        document.querySelector(`.left .block:nth-child(${colIndex + 7})`)
    ];

    const rightLayer = [
        document.querySelector(`.right .block:nth-child(${colIndex + 1})`),
        document.querySelector(`.right .block:nth-child(${colIndex + 4})`),
        document.querySelector(`.right .block:nth-child(${colIndex + 7})`)
    ];

    const topLayer = [
        document.querySelector(`.top .block:nth-child(${colIndex + 1})`),
        document.querySelector(`.top .block:nth-child(${colIndex + 4})`),
        document.querySelector(`.top .block:nth-child(${colIndex + 7})`)
    ];

    const bottomLayer = [
        document.querySelector(`.bottom .block:nth-child(${colIndex + 1})`),
        document.querySelector(`.bottom .block:nth-child(${colIndex + 4})`),
        document.querySelector(`.bottom .block:nth-child(${colIndex + 7})`)
    ];
    
    return { frontLayer, backLayer, leftLayer, rightLayer, topLayer, bottomLayer };
}


function updateBlockColors() {
    const colorMap = {
        'R': 'red',
        'O': 'orange',
        'B': 'blue',
        'G': 'green',
        'Y': 'yellow',
        'W': 'white'  // Add more colors as necessary
    };

    // Select all blocks across all faces of the cube
    const allBlocks = document.querySelectorAll('.block');

    // Update the color of each block based on its data-color attribute
    allBlocks.forEach(block => {
        const colorLetter = block.getAttribute('data-color'); // Get the color letter from data attribute
        block.style.backgroundColor = colorMap[colorLetter] || 'transparent'; // Set color
    });
}


// Add a savedBackLayer to store the specific column state before twisting rows
let savedBackLayer = [];

// Function to save a specific column in the back layer
function saveBackLayerColumn(columnIndex) {
    savedBackLayer = []; // Clear previous saved values

    // Save the specific column from the back layer
    trueBackLayer = Array.from(document.querySelectorAll('.back .block'));
    
    // Store only the blocks in the specified column
    for (let i = 0; i < 3; i++) {
        savedBackLayer.push(trueBackLayer[i * 3 + columnIndex].innerText);
    }

    console.log("Saved Back Layer Column:", savedBackLayer);
}





let isSuperTicTacToeMode = ""


function rotateLayers(layers, type, columnIndex = null, isSuperTicTacToeMode = false) {
    let { frontLayer, backLayer, leftLayer, rightLayer, topLayer, bottomLayer } = layers;

    if (type === 'row') {
        // Store current row state for data-color and inner text
        const tempFrontColors = frontLayer.map(block => block.getAttribute('data-color'));
        const tempBackColors = backLayer.map(block => block.getAttribute('data-color'));
        const tempLeftColors = leftLayer.map(block => block.getAttribute('data-color'));
        const tempRightColors = rightLayer.map(block => block.getAttribute('data-color'));

        const tempFrontText = frontLayer.map(block => block.innerText);
        const tempBackText = backLayer.map(block => block.innerText);
        const tempLeftText = leftLayer.map(block => block.innerText);
        const tempRightText = rightLayer.map(block => block.innerText);

        // Rotate the row (front <-> back, left <-> right)
        frontLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempLeftColors[index]); // Set front color to left
            block.innerText = tempLeftText[index]; // Set front text to left text
        });
        leftLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempBackColors[index]); // Set left color to back
            block.innerText = tempBackText[index]; // Set left text to back text
        });
        backLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempRightColors[index]); // Set back color to right
            block.innerText = tempRightText[index]; // Set back text to right text
        });
        rightLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempFrontColors[index]); // Set right color to front
            block.innerText = tempFrontText[index]; // Set right text to front text
        });

        // If super Tic Tac Toe mode is activated, transfer cells
        if (isSuperTicTacToeMode) {
            transferCells(frontLayer, leftLayer);
            transferCells(leftLayer, backLayer);
            transferCells(backLayer, rightLayer);
            transferCells(rightLayer, frontLayer);
        }

        if (columnIndex == 2) {
            rotateFace('bottom', 'clockwise');
        } else if (columnIndex == 0) {
            rotateFace('top', 'counterclockwise');
        }
    } else if (type === 'column') {
        // Store current column state for data-color and inner text
        const tempFrontColors = frontLayer.map(block => block.getAttribute('data-color'));
        const tempBackColors = backLayer.map(block => block.getAttribute('data-color'));
        const tempTopColors = topLayer.map(block => block.getAttribute('data-color'));
        const tempBottomColors = bottomLayer.map(block => block.getAttribute('data-color'));

        const tempFrontText = frontLayer.map(block => block.innerText);
        const tempBackText = backLayer.map(block => block.innerText);
        const tempTopText = topLayer.map(block => block.innerText);
        const tempBottomText = bottomLayer.map(block => block.innerText);

        // Rotate the column (top <-> bottom, front <-> back)
        frontLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempTopColors[index]); // Set front color to top
            block.innerText = tempTopText[index]; // Set front text to top text
        });

        backLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempBottomColors[2 - index]); // Set back color to bottom
            block.innerText = tempBottomText[2 - index]; // Set back text to bottom text
        });

        topLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempBackColors[2 - index]); // Set top color to back
            block.innerText = tempBackText[2 - index]; // Set top text to back text
        });

        bottomLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempFrontColors[index]); // Set bottom color to front
            block.innerText = tempFrontText[index]; // Set bottom text to front text
        });

        // If super Tic Tac Toe mode is activated, transfer cells
        if (isSuperTicTacToeMode) {
            transferCells(frontLayer, topLayer);
            transferCells(topLayer, backLayer);
            transferCells(backLayer, bottomLayer);
            transferCells(bottomLayer, frontLayer);
        }

        if (columnIndex == 2) {
            rotateFace('right', 'counterclockwise');
        } else if (columnIndex == 0) {
            rotateFace('left', 'clockwise');
        }
    }

    // Update the colors of the blocks after rotation
    updateBlockColors(); // Call this function to apply the background colors
}

// Function to transfer the cells between two layers
function transferCells(sourceLayer, targetLayer) {
    sourceLayer.forEach((sourceBlock, index) => {
        const sourceCells = sourceBlock.querySelectorAll('.cell');
        const targetBlock = targetLayer[index];
        const targetCells = targetBlock.querySelectorAll('.cell');

        // Transfer contents of cells
        sourceCells.forEach((cell, cellIndex) => {
            const targetCell = targetCells[cellIndex];
            if (cell.innerText) {
                targetCell.innerText = cell.innerText; // Copy text
                targetCell.setAttribute('data-color', cell.getAttribute('data-color')); // Copy color
            }
        });
    });
}

// Variable to keep track of the current player ("X" or "O")


const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
];

// Function to check for wins on a given face
function checkWin(faceBlocks) {
    const winners = [];
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        // Check if all three blocks in the combination have the same non-empty value
        if (faceBlocks[a].innerText &&
            faceBlocks[a].innerText === faceBlocks[b].innerText &&
            faceBlocks[a].innerText === faceBlocks[c].innerText) {
            winners.push(faceBlocks[a].innerText); // Store the winning symbol ("X" or "O")
        }
    }
    return winners; // Return an array of winning symbols
}

// Global variables for storing player wins
let playerWins = new Map(); // Map to store each player's win count dynamically
let players = ["X", "O"]; // Default players, but can be set dynamically
let currentPlayerIndex = 0;
let currentPlayer = players[currentPlayerIndex];
let versusMode = false

// Function to initialize game settings and scoreboard for multiple players
function initializeGame(mode = "classic", numPlayers = 2) {
    players = ["X", "O"]; // Default players for Classic mode

    // If Custom mode, create additional players
    if (mode === "custom" && numPlayers > 2) {
        const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 2; i < numPlayers; i++) {
            players.push(symbols[i]);
        }
    } else if (mode === "versus") {
        versusMode = true
        tickTackToePlayer = "X"
        rubixCubeSolver = "O"
        scrambleCube(); //TODO: Add other difficulties to this
    }

    // Initialize win counts for each player in the playerWins Map
    playerWins.clear();
    players.forEach(player => playerWins.set(player, 0));

    currentPlayerIndex = 0;
    currentPlayer = players[currentPlayerIndex];
    console.log(`Game initialized in ${mode} mode with players: ${players.join(", ")}`);
    updateScoreboard(); // Initialize the scoreboard display
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // Clear existing scoreboard

    players.forEach(player => {
        const playerWinCount = playerWins.get(player) || 0;
        const playerScoreElement = document.createElement('div');
        playerScoreElement.innerText = `${player} Wins: ${playerWinCount}`;
        playerScoreElement.id = `${player}Wins`; // Set a unique ID for each player
        
        // Highlight the current player's score in a different color
        if (player === currentPlayer) {
            playerScoreElement.style.color = "blue"; // Set highlight color (e.g., blue)
            playerScoreElement.style.fontWeight = "bold"; // Optionally make it bold
        } else {
            playerScoreElement.style.color = "black"; // Default color for other players
            playerScoreElement.style.fontWeight = "normal";
        }

        scoreboard.appendChild(playerScoreElement);
    });
}

// Function to check if a player has won on a cube face
function checkCubeWin() {
    console.log("Winner", currentPlayer)
    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    const overallWinners = new Map();
    const faceWinners = {}; // Track winners per face

    faces.forEach(face => {
        const faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
        const winners = checkWin(faceBlocks);

        if (winners.length > 0) {
            console.log("WINSTER", winners)
            winners.forEach(winner => {
                overallWinners.set(winner, (overallWinners.get(winner) || 0) + 1);
            });
            faceWinners[face] = winners; // Store winners for this face
        }
    });

    // Determine the leading player or if there's a draw
    if (overallWinners.size > 0) {
        let leadingPlayer = null;
        let maxWins = 0;
        let isDraw = true;

        overallWinners.forEach((wins, player) => {
            if (wins > maxWins) {
                maxWins = wins;
                leadingPlayer = player;
                isDraw = false;
                console.log("WINNY" + leadingPlayer, maxWins, overallWinners, overallWinners.get(player), player)
                
            } else if (wins === maxWins) {
                isDraw = true;
            }
        });
        

        if (isDraw) {
            console.log("It's a draw! Game continues.");
            return;
        }

        // Adjust the win count for the winning player
        let showWin = false
        if (delayedWin) {
            if (leadingPlayer == currentPlayer) {
                console.log("SHOW WINS", leadingPlayer, currentPlayer)
                showWin = true
            } else {
                return
            }
           
        } else {
            showWin = true
        }
        if (showWin) {
            if (versusMode === true) {
                console.log("Win check", maxWins, winRequirement, leadingPlayer, tickTackToePlayer);
                
                // Retrieve the scores, defaulting to 0 if undefined
                const tickTackToeWins = overallWinners.get(tickTackToePlayer) || 0;
                const rubixCubeSolverWins = overallWinners.get(rubixCubeSolver) || 0;
                
                // Calculate the difference
                const winDifference = tickTackToeWins - rubixCubeSolverWins;
            
                console.log(tickTackToeWins, rubixCubeSolverWins);
            
                if (winDifference >= winRequirement) {
                    alert("Ticktacktoer won!");
                }
            

            } else {
                const winnerCount = maxWins;
                playerWins.set(leadingPlayer, (playerWins.get(leadingPlayer) || 0) + winnerCount);
                updateScoreboard(); // Refresh the scoreboard

                setTimeout(() => {
                    const winnerMessage = `${leadingPlayer} wins! Total wins updated.`;
                    alert(winnerMessage);
                    resetGame(); // Reset the game for another round
                }, 200);
            }
        }
    }
}

function checkRubixWin() {
    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    let allFacesSingleColor = true; // Track if all faces are solid in color

    for (const face of faces) {
        const faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
        
        // Get the color of the first block in the face
        const firstBlockColor = faceBlocks[0].style.backgroundColor;
        
        // Check if all blocks have the same color as the first block
        const isSingleColor = faceBlocks.every(block => block.style.backgroundColor === firstBlockColor);
        
        if (!isSingleColor) {
            allFacesSingleColor = false;
            break; // No need to continue if one face isn't single-colored
        }
    }

    // Trigger the win state if all faces are single-colored
    if (allFacesSingleColor) {
        setTimeout(() => {
            alert("Congratulations! The Rubik's cube is solved!");
            resetGame(); // Reset the game for another round
        }, 200);
    }
}





function resetGame() {
    const faces = {
        front: 'red',
        back: 'orange',
        right: 'green',
        left: 'blue',
        top: 'yellow',
        bottom: 'white'
    };

    // Loop through each face and reset the blocks
    for (const face in faces) {
        const faceBlocks = document.querySelectorAll(`.${face} .block`);
        faceBlocks.forEach(block => {
            block.innerText = ''; // Clear inner text
            block.style.backgroundColor = faces[face]; // Set to the face's color
            block.setAttribute('data-color', ''); // Optional: Clear color data attribute
        });
    }

    currentPlayerIndex = 0;
    currentPlayer = players[currentPlayerIndex];

    // Reset scoreboard display
}






// Initialize Tic-Tac-Toe with win-check functionality
function initializeTicTacToe() {
    const allBlocks = document.querySelectorAll('.block');
    allBlocks.forEach(block => {
        block.addEventListener('click', handleBlockClick);
    });
}

// Function to rotate the left column
function rotateLeftColumn() {
    const layers = getColumnLayers(0); // Get layers for the left column (index 0)
    const { frontLayer, backLayer, topLayer, bottomLayer } = layers;

    // Store current state of each layer
    const tempFrontColors = frontLayer.map(block => block.getAttribute('data-color'));
    const tempBackColors = backLayer.map(block => block.getAttribute('data-color'));
    const tempTopColors = topLayer.map(block => block.getAttribute('data-color'));
    const tempBottomColors = bottomLayer.map(block => block.getAttribute('data-color'));

    const tempFrontText = frontLayer.map(block => block.innerText);
    const tempBackText = backLayer.map(block => block.innerText);
    const tempTopText = topLayer.map(block => block.innerText);
    const tempBottomText = bottomLayer.map(block => block.innerText);

    // Perform the rotation
    frontLayer.forEach((block, index) => {
        block.setAttribute('data-color', tempTopColors[index]);
        block.innerText = tempTopText[index];
    });

    topLayer.forEach((block, index) => {
        block.setAttribute('data-color', tempBackColors[2 - index]); // Reverse order for back
        block.innerText = tempBackText[2 - index];
    });

    backLayer.forEach((block, index) => {
        block.setAttribute('data-color', tempBottomColors[index]);
        block.innerText = tempBottomText[index];
    });

    bottomLayer.forEach((block, index) => {
        block.setAttribute('data-color', tempFrontColors[index]);
        block.innerText = tempFrontText[index];
    });

    updateBlockColors();
}

function rotateSColumn(columnIndex) {
    // Calculate the opposite column index for the right face
    const oppositeColumnIndex = 2 - columnIndex;

    // Get all layers from the cube faces
    const frontLayer = Array.from(document.querySelectorAll('.front .block'));
    const backLayer = Array.from(document.querySelectorAll('.back .block'));
    const leftLayer = Array.from(document.querySelectorAll('.left .block'));
    const rightLayer = Array.from(document.querySelectorAll('.right .block'));
    const topLayer = Array.from(document.querySelectorAll('.top .block'));
    const bottomLayer = Array.from(document.querySelectorAll('.bottom .block'));

    // Store the current state of each layer
    const tempFrontColors = frontLayer.map(block => block.getAttribute('data-color'));
    const tempBackColors = backLayer.map(block => block.getAttribute('data-color'));
    const tempLeftColors = leftLayer.map(block => block.getAttribute('data-color'));
    const tempRightColors = rightLayer.map(block => block.getAttribute('data-color'));
    const tempTopColors = topLayer.map(block => block.getAttribute('data-color'));
    const tempBottomColors = bottomLayer.map(block => block.getAttribute('data-color'));

    const tempFrontText = frontLayer.map(block => block.innerText);
    const tempBackText = backLayer.map(block => block.innerText);
    const tempLeftText = leftLayer.map(block => block.innerText);
    const tempRightText = rightLayer.map(block => block.innerText);
    const tempTopText = topLayer.map(block => block.innerText);
    const tempBottomText = bottomLayer.map(block => block.innerText);

    // Perform the rotation based on the selected column index:
    
    // 1. Move the selected column of the left face to the corresponding row of the bottom face
    for (let i = 0; i < 3; i++) {
        bottomLayer[oppositeColumnIndex * 3 + i].setAttribute('data-color', tempLeftColors[i * 3 + columnIndex]);
        bottomLayer[oppositeColumnIndex * 3 + i].innerText = tempLeftText[i * 3 + columnIndex];
    }

    // 2. Move the row from the bottom face to the opposite column of the right face in reverse order
    for (let i = 0; i < 3; i++) {
        rightLayer[i * 3 + oppositeColumnIndex].setAttribute('data-color', tempBottomColors[oppositeColumnIndex * 3 + (2 - i)]);
        rightLayer[i * 3 + oppositeColumnIndex].innerText = tempBottomText[oppositeColumnIndex * 3 + (2 - i)];
    }

    // 3. Move the column from the right face to the row of the top face
    for (let i = 0; i < 3; i++) {
        topLayer[columnIndex * 3 + i].setAttribute('data-color', tempRightColors[i * 3 + oppositeColumnIndex]);
        topLayer[columnIndex * 3 + i].innerText = tempRightText[i * 3 + oppositeColumnIndex];
    }

   // 4. Move the row from the top face to the selected column of the left face in reverse order
   for (let i = 0; i < 3; i++) {
    leftLayer[i * 3 + columnIndex].setAttribute('data-color', tempTopColors[columnIndex * 3 + (2 - i)]);
    leftLayer[i * 3 + columnIndex].innerText = tempTopText[columnIndex * 3 + (2 - i)];
}
    // Update colors of blocks
    updateBlockColors();
    if (columnIndex == 2) {
        rotateFace('front', 'counterclockwise');
        
        
    } else if (columnIndex == 0) {
            rotateFace('back', 'clockwise');
        }

    
    
}





// Event listeners for the new buttons



// Start the Tic-Tac-Toe game
initializeTicTacToe();


function rotateFace(face, direction) {
    // Get the blocks of the specified face
    const blocks = Array.from(document.querySelectorAll(`.${face} .block`));
    
    // Ensure we have exactly 9 blocks
    if (blocks.length !== 9) {
        console.error('Expected exactly 9 blocks for a face.');
        return;
    }

    // Create an array to hold the current colors/text
    const currentColors = blocks.map(block => block.getAttribute('data-color'));
    const currentTexts = blocks.map(block => block.innerText);

    // Rotate colors and texts based on the direction
    if (direction === 'clockwise') {
        blocks[0].setAttribute('data-color', currentColors[6]); // 0 -> 6
        blocks[1].setAttribute('data-color', currentColors[3]); // 1 -> 3
        blocks[2].setAttribute('data-color', currentColors[0]); // 2 -> 0
        blocks[3].setAttribute('data-color', currentColors[7]); // 3 -> 7
        blocks[4].setAttribute('data-color', currentColors[4]); // 4 stays the same
        blocks[5].setAttribute('data-color', currentColors[1]); // 5 -> 1
        blocks[6].setAttribute('data-color', currentColors[8]); // 6 -> 8
        blocks[7].setAttribute('data-color', currentColors[5]); // 7 -> 5
        blocks[8].setAttribute('data-color', currentColors[2]); // 8 -> 2

        // Update texts accordingly
        blocks[0].innerText = currentTexts[6]; // 0 -> 6
        blocks[1].innerText = currentTexts[3]; // 1 -> 3
        blocks[2].innerText = currentTexts[0]; // 2 -> 0
        blocks[3].innerText = currentTexts[7]; // 3 -> 7
        blocks[4].innerText = currentTexts[4]; // 4 stays the same
        blocks[5].innerText = currentTexts[1]; // 5 -> 1
        blocks[6].innerText = currentTexts[8]; // 6 -> 8
        blocks[7].innerText = currentTexts[5]; // 7 -> 5
        blocks[8].innerText = currentTexts[2]; // 8 -> 2

    } else if (direction === 'counterclockwise') {
        blocks[0].setAttribute('data-color', currentColors[2]); // 0 -> 2
        blocks[1].setAttribute('data-color', currentColors[5]); // 1 -> 5
        blocks[2].setAttribute('data-color', currentColors[8]); // 2 -> 8
        blocks[3].setAttribute('data-color', currentColors[1]); // 3 -> 1
        blocks[4].setAttribute('data-color', currentColors[4]); // 4 stays the same
        blocks[5].setAttribute('data-color', currentColors[7]); // 5 -> 3
        blocks[6].setAttribute('data-color', currentColors[0]); // 6 -> 0
        blocks[7].setAttribute('data-color', currentColors[3]); // 7 stays the same
        blocks[8].setAttribute('data-color', currentColors[6]); // 8 -> 6

        // Update texts accordingly
        blocks[0].innerText = currentTexts[2]; // 0 -> 2
        blocks[1].innerText = currentTexts[5]; // 1 -> 5
        blocks[2].innerText = currentTexts[8]; // 2 -> 8
        blocks[3].innerText = currentTexts[1]; // 3 -> 1
        blocks[4].innerText = currentTexts[4]; // 4 stays the same
        blocks[5].innerText = currentTexts[7]; // 5 -> 3
        blocks[6].innerText = currentTexts[0]; // 6 -> 0
        blocks[7].innerText = currentTexts[3]; // 7 stays the same
        blocks[8].innerText = currentTexts[6]; // 8 -> 6
    } else {
        console.error('Invalid direction. Use "clockwise" or "counterclockwise".');
        return;
    }

    // Update colors of blocks (if you have a function for this)
    updateBlockColors();

}
let startBlock = null;      // Store the block where the drag starts
let startX = 0, startY = 0; // Store the initial coordinates of mousedown

// Global move history stack to keep track of moves
const moveHistory = [];

function getRowOrColumn(blockId, direction, skipHistory = false) {
    const face = blockId[0];                  // Get the face letter from the first character of the ID
    const blockNumber = parseInt(blockId[1]); // Get the block number from the second character of the ID
    const row = Math.floor(blockNumber / 3);  // Calculate row (0, 1, 2)
    const col = blockNumber % 3;              // Calculate column (0, 1, 2)
    let angle = "";
    let mirroredCol = "";

    // Determine the angle and direction of the swipe
    switch (direction) {
        case 'right':
        case 'left':
            angle = "horizontal";
            break;
        case 'up':
        case 'down':
            angle = "vertical";
            break;
        default:
            console.log(`Unknown swipe direction: ${direction}`);
            return; // Exit if direction is unknown
    }

    if (angle === "horizontal") {
        console.log(`Swiped ${direction} in row ${row} on face ${face}`);
    } else {
        console.log(`Swiped ${direction} in column ${col} on face ${face}`);
    }

    // Save the move to history
    if (!skipHistory) {
        moveHistory.push({
            type: 'swipe',
            face,
            row,
            col,
            direction,
            angle
        });
    }

    // Handle the rotation based on direction and face
    switch (angle) {
        case "horizontal":
            // Handle left/right swipes (rows)
            switch (face) {
                case 'f': // Front face
                case 'b': // Back face
                case 'l': // Left face
                case 'r': // Right face
                    // Determine the rotation direction
                    switch (direction) {
                        case 'right':
                            rotateRow(row); // Call row function with the row number
                            console.log(`Rotated row ${row} on face ${face} clockwise`);
                            break;
                        case 'left':
                            for (let i = 0; i < 3; i++) {
                                rotateRow(row); // Call row function three times for counterclockwise
                            }
                            console.log(`Rotated row ${row} on face ${face} counterclockwise`);
                            break;
                    }
                    break;

                case 'd': // Bottom face
                    mirroredCol = mirrorRowOrColumn(row);
                    switch (direction) {
                        case 'right':
                            rotateSColumn(mirroredCol);
                            console.log(`Rotated column ${mirroredCol} on face ${face} clockwise`);
                            break;
                        case 'left':
                            for (let i = 0; i < 3; i++) {
                                rotateSColumn(mirroredCol); // Counterclockwise
                            }
                            console.log(`Rotated column ${mirroredCol} on face ${face} counterclockwise`);
                            break;
                    }
                    break;

                case 'u': // Top face
                    switch (direction) {
                        case 'right':
                            for (let i = 0; i < 3; i++) {
                                rotateSColumn(row); // Counterclockwise
                            }
                            console.log(`Rotated column ${row} on face ${face} counterclockwise`);
                            break;
                            
                        case 'left':
                            rotateSColumn(row); // Call row function with the row number
                            console.log(`Rotated column ${row} on face ${face} clockwise`);
                            break;
                    }
                    break;

                default:
                    console.log(`Swipe direction ${direction} on face ${face} is not handled.`);
            }
            break;

        case "vertical":
            // Handle up/down swipes (columns)
            switch (face) {
                case 'f': // Front face
                case 'u': // Up face
                case 'd': // Down face
                    switch (direction) {
                        case 'down':
                            rotateColumn(col);
                            console.log(`Rotated column ${col} on face ${face} clockwise`);
                            break;
                        case 'up':
                            for (let i = 0; i < 3; i++) {
                                rotateColumn(col); // Counterclockwise
                            }
                            console.log(`Rotated column ${col} on face ${face} counterclockwise`);
                            break;
                    }
                    break;

                case 'b': // Back face
                    mirroredCol = mirrorRowOrColumn(col);
                    switch (direction) {
                        case 'down':
                            rotateColumn(mirroredCol);
                            console.log(`Rotated column ${mirroredCol} on face ${face} clockwise`);
                            break;
                        case 'up':
                            for (let i = 0; i < 3; i++) {
                                rotateColumn(mirroredCol); // Counterclockwise
                            }
                            console.log(`Rotated column ${mirroredCol} on face ${face} counterclockwise`);
                            break;
                    }
                    break;

                case 'l': // Left face
                    switch (direction) {
                        case 'down':
                            rotateSColumn(col);
                            console.log(`Rotated column ${col} on face ${face} clockwise`);
                            break;
                        case 'up':
                            for (let i = 0; i < 3; i++) {
                                rotateSColumn(col); // Counterclockwise
                            }
                            console.log(`Rotated column ${col} on face ${face} counterclockwise`);
                            break;
                    }
                    break;

                case 'r': // Right face
                    mirroredCol = mirrorRowOrColumn(col);
                    switch (direction) {
                        case 'down':
                            for (let i = 0; i < 3; i++) {
                                rotateSColumn(mirroredCol); // Counterclockwise
                            }
                            console.log(`Rotated column ${mirroredCol} on face ${face} counterclockwise`);
                            break;
                            
                        case 'up':
                            rotateSColumn(mirroredCol);
                            console.log(`Rotated column ${mirroredCol} on face ${face} clockwise`);
                            break;
                            
                    }
                    break;

                default:
                    console.log(`Swipe direction ${direction} on face ${face} is not handled.`);
            }
            break;

        default:
            console.log(`Unknown swipe direction: ${direction}`);
    }
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayer = players[currentPlayerIndex];
    console.log("Next turn: Player", currentPlayer);
    updateScoreboard()
    if (versusMode === true) {
        checkRubixWin()
    }
    checkCubeWin();
}

function undoLastMove() {
    if (moveHistory.length === 0) {
        console.log("No moves to undo");
        return;
    }

    // Get the last move
    const lastMove = moveHistory.pop();

    if (lastMove.type === 'placement') {
        // Undo a block placement
        const block = document.getElementById(lastMove.blockId);
        if (block) {
            block.innerText = ""; // Clear the block
            console.log(`Undid placement on ${lastMove.blockId} by Player ${lastMove.player}`);
        }

        // Restore the player to the previous one
        currentPlayerIndex = players.indexOf(lastMove.player);
        currentPlayer = players[currentPlayerIndex];
        updateScoreboard();
        console.log(`Reverting to previous turn: Player ${currentPlayer}`);
    } else if (lastMove.type === 'swipe') {
        // Undo a swipe by reversing direction
        const reverseDirection = (dir) => {
            switch (dir) {
                case 'right': return 'left';
                case 'left': return 'right';
                case 'up': return 'down';
                case 'down': return 'up';
            }
        };

        // Perform the reverse swipe
        getRowOrColumn(`${lastMove.face}${lastMove.row * 3 + lastMove.col}`, reverseDirection(lastMove.direction), true);
        console.log("Undid swipe:", lastMove);
    }
}




function mirrorRowOrColumn(or) {
    switch (or) {
        case 0:
            return 2; // Mirror 0 to 2
        case 1:
            return 1; // Stay as 1
        case 2:
            return 0; // Mirror 2 to 0
        default:
            return or; // Fallback
    }
}




// Track the starting position on mouse down or touch start
function handleBlockMouseDown(event) {
    event.preventDefault();
    startBlock = event.target.closest('.block'); // Closest .block to handle both .block and .cell elements
    startX = event.clientX || event.touches[0].clientX; // Capture initial X coordinate
    startY = event.clientY || event.touches[0].clientY; // Capture initial Y coordinate
    console.log("Drag started on:", startBlock.id, "at coordinates:", startX, startY);
}

function handleBlockMouseUp(event) {
    const endBlock = event.target; // Get the block where mouseup occurred
    console.log("End: " + endBlock.id);

    // If start and end block are the same, treat as a click
    if (startBlock === endBlock) {
        handleBlockClick(event); // Call the click handler
    } else {
        // Extract block numbers from IDs
        const startBlockNumber = parseInt(startBlock.id[1]); // Get the block number from the start block
        const endBlockNumber = parseInt(endBlock.id[1]);     // Get the block number from the end block

        // Determine the direction of the swipe based on block numbers
        const rowStart = Math.floor(startBlockNumber / 3);
        const rowEnd = Math.floor(endBlockNumber / 3);
        const colStart = startBlockNumber % 3;
        const colEnd = endBlockNumber % 3;

        if (rowStart === rowEnd) {
            // Horizontal swipe (left or right)
            if (colEnd > colStart) {
                console.log("Dragged right");
                getRowOrColumn(startBlock.id, "right");
            } else {
                console.log("Dragged left");
                getRowOrColumn(startBlock.id, "left");
            }
        } else if (colStart === colEnd) {
            // Vertical swipe (up or down)
            if (rowEnd > rowStart) {
                console.log("Dragged down");
                getRowOrColumn(startBlock.id, "down");
            } else {
                console.log("Dragged up");
                getRowOrColumn(startBlock.id, "up");
            }
        } else {
            console.log("Invalid swipe. It must be either horizontal or vertical.");
        }
    }
}


// Handle clicks on cells
function handleCellClick(event, cell) {
    // Only set the text if the cell is empty
    if (!cell.innerText) {
        cell.innerText = currentPlayer; // Set current player's symbol
        

        // Move to the next player
        //currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        //currentPlayer = players[currentPlayerIndex];
        updateScoreboard();
        checkCubeWin(); // Check win condition
        console.log("Next turn: Player", currentPlayer);
    }
}

// Handle clicks on blocks



// Track block placements and swipes in history and enable undo
function handleBlockClick(event) {
    const block = event.target.closest('.block');

    // Check if the block is empty (to prevent overwriting)
    if (!block.innerText) {
        // Place the current player's sign
        block.innerText = currentPlayer;

        // Save this move to history for undo purposes
        moveHistory.push({
            type: 'placement',
            blockId: block.id,
            player: currentPlayer
        });
        console.log(`Player ${currentPlayer} placed on ${block.id}`);

        // Check win condition and update the turn
        

        // Switch players
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayer = players[currentPlayerIndex];
        checkCubeWin();
        updateScoreboard();
        console.log("Next turn: Player", currentPlayer);
    }
}

// Attach event listeners for both .block and .cell
document.querySelectorAll('.block').forEach(element => {
    element.addEventListener('mousedown', handleBlockMouseDown);
    element.addEventListener('mouseup', handleBlockMouseUp);
    element.addEventListener('touchstart', handleBlockMouseDown);
    element.addEventListener('touchend', handleBlockMouseUp);
});

// Attach event listeners for cells to handle direct clicks
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', (event) => handleCellClick(event, cell)); // Handle clicks directly on cells
});

function transferCells(sourceLayer, targetLayer) {
    sourceLayer.forEach((sourceBlock, index) => {
        const sourceCells = Array.from(sourceBlock.querySelectorAll('.cell')); // Get cells as an array
        const targetBlock = targetLayer[index];

        // Clear the target block's cells first
        targetBlock.innerHTML = ''; // Ensure target is empty before appending new cells

        // Move and transfer contents of cells
        sourceCells.forEach(cell => {
            // Create a new cell element
            const newCell = document.createElement('div');
            newCell.className = 'cell'; // Assign the class to the new cell

            // Transfer innerText and data-color from the source cell
            newCell.innerText = cell.innerText; // Copy text
            newCell.setAttribute('data-color', cell.getAttribute('data-color')); // Copy color

            // Append the new cell to the target block
            targetBlock.appendChild(newCell);
        });
    });
}

function resetCubeRotation() {
    rotationX = 0;
    rotationY = 0;
    cube.style.transform = `rotateX(0deg) rotateY(0deg)`;
}

initializeGame("classic", 2);


function scrambleCube() {
    const minMoves = 5;
    const maxMoves = 9;
    let remainingMoves = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
    console.log("Moves " + remainingMoves);

    // Track twist counts for rows, columns, and S-columns
    const twistCounts = {
        row: [0, 0, 0],
        column: [0, 0, 0],
        sColumn: [0, 0, 0]
    };

    // Helper function to calculate entropy for a face
    function calculateFaceEntropy(face) {
        const blocks = Array.from(document.querySelectorAll(`.${face} .block`));
        const colorSet = new Set(blocks.map(block => block.style.backgroundColor));
        return colorSet.size;  // More unique colors mean higher entropy
    }

    // Helper function to calculate total entropy for all faces
    function calculateTotalEntropy() {
        const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
        return faces.reduce((totalEntropy, face) => totalEntropy + calculateFaceEntropy(face), 0);
    }

    // Initial entropy before scrambling
    let currentEntropy = calculateTotalEntropy();

    // Function to apply a move and check entropy increase
    function applyMove(type, index, twistCount) {
        switch (type) {
            case 0:
                for (let j = 0; j < twistCount; j++) rotateRow(index);
                twistCounts.row[index] += twistCount; // Track row twists
                break;
            case 1:
                for (let j = 0; j < twistCount; j++) rotateColumn(index);
                twistCounts.column[index] += twistCount; // Track column twists
                break;
            case 2:
                for (let j = 0; j < twistCount; j++) rotateSColumn(index);
                twistCounts.sColumn[index] += twistCount; // Track S-column twists
                break;
        }
    }

    // Weighted random choice based on twist frequency
    function weightedRandomMove() {
        const moves = [
            { type: 0, counts: twistCounts.row },
            { type: 1, counts: twistCounts.column },
            { type: 2, counts: twistCounts.sColumn }
        ];

        // Calculate weights for each move
        const weights = moves.map(move => {
            const minTwistCount = Math.min(...move.counts);  // Lowest twist count for this move type
            return move.counts.map(count => minTwistCount + 1 - count).map(weight => Math.max(weight, 1));
        });

        // Flattened weighted choices (moveType, index) pairs
        const weightedChoices = [];
        weights.forEach((moveWeights, moveType) => {
            moveWeights.forEach((weight, index) => {
                for (let i = 0; i < weight; i++) {
                    weightedChoices.push({ moveType, index });
                }
            });
        });

        // Randomly select a move with bias towards untwisted options
        const choice = weightedChoices[Math.floor(Math.random() * weightedChoices.length)];
        return choice;
    }

    while (remainingMoves > 0) {
        const { moveType, index } = weightedRandomMove();
        const twistCount = Math.min(Math.floor(Math.random() * 3) + 1, remainingMoves); // 1 to 3 twists, capped at remaining moves

        // Apply the move and measure entropy
        applyMove(moveType, index, twistCount);
        const newEntropy = calculateTotalEntropy();

        // Check if entropy increased; if not, revert the move
        if (newEntropy >= currentEntropy) {
            currentEntropy = newEntropy; // Keep the move if entropy increased
            console.log(`Move accepted: ${moveType === 0 ? 'Row' : moveType === 1 ? 'Column' : 'SColumn'} ${index}, ${twistCount} time(s)`);
            remainingMoves -= twistCount; // Reduce remaining moves
        } else {
            // Revert the move by applying the opposite rotations
            applyMove(moveType, index, twistCount * -1); // Reverse the move
            console.log(`Move rejected, reverting: ${moveType === 0 ? 'Row' : moveType === 1 ? 'Column' : 'SColumn'} ${index}, ${twistCount} time(s)`);
        }
    }

    console.log("Scramble complete with high entropy!");
}



function initializeCustomMode() {
    let players = prompt("Enter the number of players for Custom Mode:", "5");
    players = parseInt(players, 10); // Convert to an integer
    if (!isNaN(players) && players > 0) {
      initializeGame('custom', players);
    } else {
      alert("Please enter a valid number of players.");
    }
  }


  function setupSuperTicTacToe() {
    // Convert each block into a 3x3 grid
    isSuperTicTacToeMode = true
    const blocks = document.querySelectorAll(".block");
    blocks.forEach(block => {
      block.innerHTML = "";  // Clear any existing text
      const innerGrid = document.createElement("div");
      innerGrid.className = "innerGrid";
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.addEventListener("click", handleCellClick);
        innerGrid.appendChild(cell);
      }
      block.appendChild(innerGrid);
    });
  }

  

  //setupSuperTicTacToe()
   //TODO: This for some reason doesn't properly delay wins like I was hoping, for some reason even it sets currentplayer to the wins it checks

  function delayedWinMode() {
    delayedWin = true
  
  }

  const randomBlocksMode = true; // Enable random blocks mode
const blockCount = 54; // Total number of blocks on the cube (6 faces * 9 blocks per face)

// Function to enable random blocks mode
function enableRandomBlocksMode() {
    if (randomBlocksMode) {
        const randomBlockCount = getRandomInt(2, 5); // Random number of blocks between 2 and 5
        const selectedBlocks = getRandomBlocks(randomBlockCount);

        selectedBlocks.forEach(block => {
            block.innerText = '+'; // Set inner text to "*"
            block.style.fontSize = '24px'; // Match font-size to your .block class
            block.style.fontWeight = 'bold'; // Match font-weight to your .block class
            block.style.display = 'flex'; // Use flexbox to center the asterisk
            block.style.justifyContent = 'center'; // Center horizontally
            block.style.alignItems = 'center'; // Center vertically
            block.style.transition = 'background-color 0.3s'; // Ensure transition matches .block
            block.classList.add('random-block'); // Optional: add a class for styling
        });
    }
}

// Helper function to get random blocks
function getRandomBlocks(count) {
    const allBlocks = Array.from(document.querySelectorAll('.block'));
    const selectedBlocks = [];

    while (selectedBlocks.length < count) {
        const randomIndex = getRandomInt(0, allBlocks.length - 1);
        const block = allBlocks[randomIndex];

        // Prevent selecting the same block twice
        if (!selectedBlocks.includes(block)) {
            selectedBlocks.push(block);
        }
    }

    return selectedBlocks;
}

// Helper function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  // Open Modal
  function openMenu() {
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById('gameModesModal').style.display = 'block';
}

// Close Modal
function closeMenu() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('gameModesModal').style.display = 'none';
}

// Select Mode Functionality
function selectMode(button, mode) {
    // Remove active class from all buttons
    document.querySelectorAll('#gameModesModal button').forEach(btn => btn.classList.remove('active'));
    // Add active class to the clicked button
    button.classList.add('active');
    // Call mode initialization based on the selected mode
    if (mode === 'classic') initializeGame('classic', 2);
    else if (mode === 'custom') initializeCustomMode();
    else if (mode === 'scramble') initializeGame('versus', 2);
    else if (mode === 'delayedWin') delayedWinMode();
    else if (mode === 'blockade') enableRandomBlocksMode();
    closeMenu();
}

// Call this function to activate the random blocks when appropriate (for example, at the start of a turn)
//enableRandomBlocksMode();
