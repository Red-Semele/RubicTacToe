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
let xPositions = [];  // Track the positions of 'X' marks involved in the trap
let dangerZones = [];
let playerMiddle = false
let playerMiddleArray = []
let dangerZone = ""
let dangerZoneCheck = ""
let aiUnblockableMove = false
let drawFace = ""
let middleTactic = false
let blockNumber
let aiPlayer
let humanPlayer
let filteredHumanResults
let filteredAiResults
let moveMade = false;
const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
const faceColors = {
    front: 'red',
    back: 'blue',
    left: 'green',
    right: 'yellow',
    top: 'orange',
    bottom: 'purple'
};
let aiDefense = false
let aiAttack = false
let groupedUpResults;
let groupedDownResults;
let groupedLeftResults;
let groupedRightResults;
let priorityAi = []
let adjacentData = []
let mostRecentFace = ""
let noBreak = false
let aiMode = false //TODO: In the ai mode, for some reason 1. After the first game on by the ai if it rotates the rows the color's don't update. also if you play from the top it's logic isn't entirely correct.
let limitedSignsMode = false
let exponentOverwriteMode = false;
const rotationData = [];
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];




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

function getBlockId(block) {
    return block.id || block.getAttribute('id') || block.getAttribute('class').match(/#(\w+)/)?.[1];
}


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

        const tempFrontHistory = frontLayer.map(block => blockHistory[getBlockId(block)] || []);
        console.log("testi", tempFrontHistory, blockHistory)
        const tempBackHistory = backLayer.map(block => blockHistory[getBlockId(block)] || []);
        const tempLeftHistory = leftLayer.map(block => blockHistory[getBlockId(block)] || []);
        const tempRightHistory = rightLayer.map(block => blockHistory[getBlockId(block)] || []);

        // Rotate the row (front <-> back, left <-> right)
        frontLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempLeftColors[index]); // Set front color to left
            block.innerText = tempLeftText[index]; // Set front text to left text
            blockHistory[getBlockId(block)] = [...tempLeftHistory[index]];
        });
        leftLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempBackColors[index]); // Set left color to back
            block.innerText = tempBackText[index]; // Set left text to back text
            blockHistory[getBlockId(block)] = [...tempBackHistory[index]];
        });
        backLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempRightColors[index]); // Set back color to right
            block.innerText = tempRightText[index]; // Set back text to right text
            blockHistory[getBlockId(block)] = [...tempRightHistory[index]];
        });
        rightLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempFrontColors[index]); // Set right color to front
            block.innerText = tempFrontText[index]; // Set right text to front text
            blockHistory[getBlockId(block)] = [...tempFrontHistory[index]];
        });


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

        const tempFrontHistory = frontLayer.map(block => blockHistory[getBlockId(block)] || []);
        const tempBackHistory = backLayer.map(block => blockHistory[getBlockId(block)] || []);
        const tempTopHistory = topLayer.map(block => blockHistory[getBlockId(block)] || []);
        const tempBottomHistory = bottomLayer.map(block => blockHistory[getBlockId(block)] || []);

        // Rotate the column (top <-> bottom, front <-> back)
        frontLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempTopColors[index]); // Set front color to top
            block.innerText = tempTopText[index]; // Set front text to top text
            blockHistory[getBlockId(block)] = [...tempTopHistory[index]];
        });

        backLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempBottomColors[2 - index]); // Set back color to bottom
            block.innerText = tempBottomText[2 - index]; // Set back text to bottom text
            blockHistory[getBlockId(block)] = [...tempBottomHistory[2 - index]];
        });

        topLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempBackColors[2 - index]); // Set top color to back
            block.innerText = tempBackText[2 - index]; // Set top text to back text
            blockHistory[getBlockId(block)] = [...tempBackHistory[2 - index]];
        });

        bottomLayer.forEach((block, index) => {
            block.setAttribute('data-color', tempFrontColors[index]); // Set bottom color to front
            block.innerText = tempFrontText[index]; // Set bottom text to front text
            blockHistory[getBlockId(block)] = [...tempFrontHistory[index]];
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
    console.log("columnIndex", columnIndex)
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

        // Determine the text value of each block (handles both plain text and innerText)
        const getText = (block) => {
            if (block === null) return ''; // Return an empty string or some fallback value
            return typeof block === 'string' ? block : block.innerText;
        };
          

        // Extract symbols without numbers
        const symbolA = getText(faceBlocks[a]).replace(/\d+/g, "");
        const symbolB = getText(faceBlocks[b]).replace(/\d+/g, "");
        const symbolC = getText(faceBlocks[c]).replace(/\d+/g, "");

        // Check if all three blocks in the combination have the same non-empty symbol
        if (symbolA && symbolA === symbolB && symbolA === symbolC) {
            winners.push(symbolA); // Store the winning symbol (e.g., "X" or "O")
        }
    }
    return winners; // Return an array of winning symbols
}

// Global variables for storing player wins
let playerWins = new Map(); // Map to store each player's win count dynamically
let players = ["X", "O"]; // Default players, but can be set dynamically
let currentPlayerIndex = 0;
let currentPlayer = players[currentPlayerIndex];
let versusMode = false;

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
        versusMode = true;
        tickTackToePlayer = "X";
        rubixCubeSolver = "O";
        scrambleCube(); // TODO: Add other difficulties to this
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
                console.log("SHOW WINS", leadingPlayer, currentPlayer) //Todo, there is a weird interaction with how the ai mode works and the deleyaed win mode, thus making the delayed win mode essentially not delayed if you play it against the ai, try to fix that.
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

    front: 'R',
    back: 'O',
    right: 'G',
    left: 'B',
    top: 'Y',
    bottom: 'W'

    };

    for (const face in faces) { 
        const faceBlocks = document.querySelectorAll(`.${face} .block`);
        faceBlocks.forEach(block => {
            block.innerText = ''; // Clear inner text
            block.style.backgroundColor = faces[face]; // Set to the face's color
            block.setAttribute('data-color', faces[face]); // Reset to the initial color
        });
    }

    updateBlockColors()



    currentPlayerIndex = 0;
    currentPlayer = players[currentPlayerIndex];

    // Reset scoreboard display
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

    const tempLeftHistory = leftLayer.map(block => blockHistory[getBlockId(block)] || []);
    const tempBottomHistory = bottomLayer.map(block => blockHistory[getBlockId(block)] || []);
    const tempRightHistory = rightLayer.map(block => blockHistory[getBlockId(block)] || []);
    const tempTopHistory = topLayer.map(block => blockHistory[getBlockId(block)] || []);

    // Perform the rotation based on the selected column index:
    
    // 1. Move the selected column of the left face to the corresponding row of the bottom face
        // 1. Move the row from the left face to the opposite column of the bottom face
    for (let i = 0; i < 3; i++) {
        bottomLayer[oppositeColumnIndex * 3 + i].setAttribute('data-color', tempLeftColors[i * 3 + columnIndex]);
        bottomLayer[oppositeColumnIndex * 3 + i].innerText = tempLeftText[i * 3 + columnIndex];
        blockHistory[getBlockId(bottomLayer[oppositeColumnIndex * 3 + i])] = tempLeftHistory[i * 3 + columnIndex];
        console.log("TESTIWESTI", )
    }

    // 2. Move the row from the bottom face to the opposite column of the right face in reverse order
    for (let i = 0; i < 3; i++) {
        rightLayer[i * 3 + oppositeColumnIndex].setAttribute('data-color', tempBottomColors[oppositeColumnIndex * 3 + (2 - i)]);
        rightLayer[i * 3 + oppositeColumnIndex].innerText = tempBottomText[oppositeColumnIndex * 3 + (2 - i)];
        blockHistory[getBlockId(rightLayer[i * 3 + oppositeColumnIndex])] = tempBottomHistory[oppositeColumnIndex * 3 + (2 - i)];
    }

    // 3. Move the column from the right face to the row of the top face
    for (let i = 0; i < 3; i++) {
        topLayer[columnIndex * 3 + i].setAttribute('data-color', tempRightColors[i * 3 + oppositeColumnIndex]);
        topLayer[columnIndex * 3 + i].innerText = tempRightText[i * 3 + oppositeColumnIndex];
        blockHistory[getBlockId(topLayer[columnIndex * 3 + i])] = tempRightHistory[i * 3 + oppositeColumnIndex];
    }

    // 4. Move the row from the top face to the selected column of the left face in reverse order
    for (let i = 0; i < 3; i++) {
        leftLayer[i * 3 + columnIndex].setAttribute('data-color', tempTopColors[columnIndex * 3 + (2 - i)]);
        leftLayer[i * 3 + columnIndex].innerText = tempTopText[columnIndex * 3 + (2 - i)];
        blockHistory[getBlockId(leftLayer[i * 3 + columnIndex])] = tempTopHistory[columnIndex * 3 + (2 - i)];
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



function rotateFace(face, direction) {
    // Get the blocks of the specified face
    const blocks = Array.from(document.querySelectorAll(`.${face} .block`));
    console.log("Face rotate test", rotationData[0])
    if (rotationData[0]) {
        if (rotationData[0][0].includes(faceToLetter(face))) {
            //TODO: above line throws error
            console.log(rotationData[0][1], "rotate test", rotationData[0])
            rotationData[0][1] = nextDirection(rotationData[0][1], direction) //Translate the way the ai should move a certain row or column to win when the player has rotated something parts of the blocks it needs.
            console.log("Face rotate test Pookie", rotationData[0][1])
            const numberMapping = {
                counterclockwise: { 0: 6, 1: 3, 2: 0, 3: 7, 4: 4, 5: 1, 6: 8, 7: 5, 8: 2 },
                clockwise: { 0: 2, 1: 5, 2: 8, 3: 1, 4: 4, 5: 7, 6: 0, 7: 3, 8: 6 }
            };
        
            let original = rotationData[0][0]; // Example: "f0"
            console.log("original", original)
            let letter = original[0]; // Extract the letter (e.g., "f")
            let number = parseInt(original[1], 10); // Extract the number (e.g., 0)
        
            if (isNaN(number) || !(number in numberMapping[direction])) return null; // Handle invalid input
        
            let newNumber = numberMapping[direction][number]; // Get new number
        
            rotationData[0][0] = letter + newNumber; // Update rotationData
            console.log("Face rotate test", rotationData[0], original, number, newNumber, direction, face)
        }
    }
    

    
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
    blockNumber = parseInt(blockId[1]); // Get the block number from the second character of the ID
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
                            for (let i = 0; i < 3; i++) {
                                rotateColumn(mirroredCol); // Counterclockwise
                            }
                            
                            console.log(`Rotated column ${mirroredCol} on face ${face} clockwise`);
                            break;
                        case 'up':
                            rotateColumn(mirroredCol);
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
   
    
    updateScoreboard()
    if (versusMode === true) {
        checkRubixWin()
    }
    checkCubeWin();
    

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayer = players[currentPlayerIndex];
    updateScoreboard()
    console.log("Next turn: Player", currentPlayer);
    
    if (aiMode === true && currentPlayer === "O") {
       
        setTimeout(() => {

            aiMove()
                checkCubeWin()
            }, 300);
            
        }
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
    alert(JSON.stringify(endBlock.id))

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





// Track each player's moves and exponents
const playerMoves = players.map(() => []); // Array of arrays to track moves for each player
const playerExponents = players.map(() => ({ 1: 4, 2: 4, 3: 4, 4: 4 })); // Independent limits for each player
const blockHistory = {}; // To track the history of signs on each block

function handleBlockClick(event) {
    const block = event.target.closest('.block');

    // Double-click handling
    if (block.dataset.lastClickTime && Date.now() - block.dataset.lastClickTime < 300) {
        handleBlockRetake(block);
        return;
    }
    block.dataset.lastClickTime = Date.now();

    if (!exponentOverwriteMode) {
        // Simplified mode: Add "X" or "O" and skip exponent logic
        if (!block.innerText) {
            block.innerText = currentPlayer; // "X" or "O"
            
            // Track the move
            moveHistory.push({
                type: 'placement',
                blockId: block.id,
                player: currentPlayer,
            });

            console.log(`Player ${currentPlayer} placed ${currentPlayer} on ${block.id}`, block);
            

         
        } else {
            console.log("Invalid move: Block already occupied.");
        }
    } else {

        // Original functionality for exponentOverwriteMode = true
        // Determine the current player's exponent dynamically
        const currentPlayerExponents = playerExponents[currentPlayerIndex];

        // Check the current state of the block
        const blockContent = block.innerText;
        const blockMatch = blockContent.match(/(\D+)(\d+)?/); // Match sign and exponent
        const blockSign = blockMatch ? blockMatch[1] : '';
        const blockExponent = blockMatch ? parseInt(blockMatch[2], 10) || 0 : 0;

        let chosenExponent = null;

        // Determine the smallest valid exponent to use
        for (let exp = blockExponent + 1; exp <= 4; exp++) {
            if (currentPlayerExponents[exp] > 0) {
                chosenExponent = exp;
                break;
            }
        }

        if (!blockContent && chosenExponent === null) {
            // If the block is empty, use the smallest available exponent
            for (let exp = 1; exp <= 4; exp++) {
                if (currentPlayerExponents[exp] > 0) {
                    chosenExponent = exp;
                    break;
                }
            }
        }

        if (chosenExponent === null) {
            console.log(`Player ${currentPlayer} has no available exponents to play.`);
            return;
        }

        // Handle block placement
        if (!blockContent || (exponentOverwriteMode && blockSign !== currentPlayer && chosenExponent > blockExponent)) {
            // Limited Signs Mode: Remove the oldest sign if max signs are exceeded
            if (limitedSignsMode) {
                if (playerMoves[currentPlayerIndex].length >= 4) {
                    const oldestMove = playerMoves[currentPlayerIndex].shift(); // Remove the oldest move
                    const oldestBlock = document.getElementById(oldestMove.blockId);
                    oldestBlock.innerText = ''; // Clear the block
                }
            }

            // Deduct the chosen exponent for the current player only
            currentPlayerExponents[chosenExponent]--;

            // Track block history
            if (!blockHistory[block.id]) blockHistory[block.id] = [];
            blockHistory[block.id].push(blockContent);

            // Place the current player's sign with the chosen exponent
            block.innerText = `${currentPlayer}${chosenExponent}`;

            // Save this move to history for undo purposes
            moveHistory.push({
                type: 'placement',
                blockId: block.id,
                player: currentPlayer,
            });

            // Save the move for Limited Signs Mode
            playerMoves[currentPlayerIndex].push({ blockId: block.id });

            console.log(`Player ${currentPlayer} placed ${currentPlayer}${chosenExponent} on ${block.id}`);
        
        } else {
            console.log("Invalid move: Block already occupied or overwrite not allowed.");
        }
    }

    let direction = block.id.charAt(0); // The letter (e.g., 'f', 'u')
    blockNumber = parseInt(block.id.substring(1), 10); // The number (e.g., '3', '1')
    

    switch (direction) {
        case 'u':
            direction = "up";
            break;
        case 'l':
            direction = "left";
            break;
        case 'r':
            direction = "right";
            break;
        case 'd':
            direction = "down";
            break;
        case 'f':
            direction = "front";
            break;
        case 'b':
            direction = "back";
            break;
        default:
            direction = "Invalid input";
    }

    if (blockNumber === 4) {
        playerMiddle = true;
        playerMiddleArray.push(direction);
    }

    console.log(direction, "Direction", groupedLeftResults);
    console.log("Checking Left Results:", checkDirectionResults(groupedLeftResults, direction, blockNumber), direction, blockNumber, groupedLeftResults);
    checkDirectionResults(groupedLeftResults, direction, blockNumber);

    console.log("Checking Right Results:");
    checkDirectionResults(groupedRightResults, direction, blockNumber);

    console.log("Checking Up Results:");
    checkDirectionResults(groupedUpResults, direction, blockNumber);

    console.log("Checking Down Results:");
    checkDirectionResults(groupedDownResults, direction, blockNumber);

    console.log(direction, mostRecentFace, "EE");
    mostRecentFace = direction;
    console.log("Mostrecent", mostRecentFace)

    // Switch players
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayer = players[currentPlayerIndex];
    console.log("Next turn: Player", currentPlayer);
    console.log("rotation data", JSON.stringify(rotationData))

    checkCubeWin();
    updateScoreboard();
    if (aiMode === true) {
        setTimeout(() => {
            aiMove();
            
        }, 100);
    }
}


function handleBlockRetake(block) {
    const blockContent = block.innerText;
    const blockMatch = blockContent.match(/(\D+)(\d+)?/); // Match sign and exponent
    const blockSign = blockMatch ? blockMatch[1] : '';
    const blockExponent = blockMatch ? parseInt(blockMatch[2], 10) || 0 : 0;

    // Only allow retake if the sign on top belongs to the current player
    if (blockSign === currentPlayer) {
        // Add the exponent back to the player's inventory
        playerExponents[currentPlayerIndex][blockExponent]++;

        // Reveal the previous sign if it exists
        const previousContent = blockHistory[block.id]?.pop() || '';
        block.innerText = previousContent;

        console.log(`Player ${currentPlayer} retook their piece from ${block.id}`);

        // Switch players
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayer = players[currentPlayerIndex];
        console.log("Next turn: Player", currentPlayer);

        updateScoreboard();
    } else {
        console.log("Invalid retake: Block does not belong to the current player.");
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

let activeModes = new Set();

function toggleMode(button, mode) {
    // Toggle active class and update activeModes set
    if (activeModes.has(mode)) {
        activeModes.delete(mode);
        button.classList.remove('active');
    } else {
        activeModes.add(mode);
        button.classList.add('active');
    }
}

function applyModes() {
    // Apply all selected modes
    activeModes.forEach(mode => {
        if (mode === 'classic') initializeGame('classic', 2);
        else if (mode === 'custom') initializeCustomMode();
        else if (mode === 'scramble') initializeGame('versus', 2);
        else if (mode === 'delayedWin') delayedWinMode();
        else if (mode === 'blockade') enableRandomBlocksMode();
        else if (mode === 'ai') enableAiMode();
        else if (mode === 'limited') initializeLimitedSigns();
        else if (mode === 'exponentOverwrite') initializeExponentOverwriteMode();
    });
    closeMenu();
}


// Call this function to activate the random blocks when appropriate (for example, at the start of a turn)
//enableRandomBlocksMode();


//Create an AI versus mode, where the AI can choose from the best moves to first block a player win if needed, and secondly to win itself.
function enableAiMode() {
    aiMode = true
}


function aiMove() {
    moveMade = false
    
    console.log("initiate ai move")
    
    let bestFace = null;
    let bestMove = -1;

    aiPlayer = 'O';
    humanPlayer = 'X';
    console.log("rotate Ai, checkdrawstate")

    console.log("No priority test")  //TODO: For some reason this seems to trigger too soon, even when there should be priority set but isn't.
    // No immediate priorities; fallback to Minimax
    let bestScore = -Infinity;

    for (const face of faces) {
        const faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
        const board = faceBlocks.map(block => block.innerText || null);
        const availableMoves = getAvailableMoves(board);

        for (const move of availableMoves) {
            board[move] = aiPlayer; // Simulate AI move
            const score = minimax(board, 0, false); //TODO: Minimax function is lost, try to find it in an old version, because right now it's broken
            board[move] = null; // Undo move

            if (score > bestScore) {
                bestScore = score;
                bestFace = face;
                bestMove = move;
            }
        }
    }

    if (rotationData.length >= 1 && minTurnsToWin("O").turns != 1) {
        console.log(rotationData[0][0])
        const content = document.querySelector(
            `div#${rotationData[0][0]}.block`
        )
        const contentCheck = content.textContent
        console.log(contentCheck, "Poppie", minTurnsToWin("O").turns, rotationData[0])
        rotateAi()
        moveMade = true
    }

    if (bestFace !== null && bestMove !== -1 && moveMade === false) {
        const faceBlocks = Array.from(document.querySelectorAll(`.${bestFace} .block`));
        
        //humanPlayer = "test"
        console.log("Test omega init")
        checkDrawState()
        if (moveMade === false)  {
            faceBlocks[bestMove].innerText = aiPlayer;
            console.log("Ai move II", bestFace, bestMove, moveMade, )
        }
        moveMade = false
        // const modifiedBoard = modifyRowOrColumn(board, "row", determineRowOrColumn(changeX, changeO), sharedArray);
    }



    function isWin(board, player) {
        
        return winPatterns.some(pattern =>
            pattern.every(index => board[index] === player)
        );
    }

  

    function getAvailableMoves(board) {
        return board.map((cell, index) => (cell === null ? index : null)).filter(index => index !== null);
    }

    function minimax(board, depth, isMaximizing) {
        if (isWin(board, aiPlayer)) return 10 - depth;
        if (isWin(board, humanPlayer)) return depth - 10;
        if (isDraw(board)) return 0;

        const availableMoves = getAvailableMoves(board);
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of availableMoves) {
                board[move] = aiPlayer;
                const evaluation = minimax(board, depth + 1, false);
                board[move] = null;
                maxEval = Math.max(maxEval, evaluation);
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of availableMoves) {
                board[move] = humanPlayer;
                const evaluation = minimax(board, depth + 1, true);
                board[move] = null;
                minEval = Math.min(minEval, evaluation);
            }
            return minEval;
        }
    }

    function isDraw(board) {
        return board.every(cell => cell !== null);
    }

    

    
    
    
    
    

    function checkDrawState() {
        console.log("DRAW CHECK")
        for (const face of faces) {
            const faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
            const board = faceBlocks.map(block => block.innerText || null);
    
            const filledTiles = board.filter(cell => cell !== null).length;
            const hasNoWins = !isWin(board, aiPlayer) && !isWin(board, humanPlayer);
            checkSquarePattern(board)
            changesForMajorityToWin(faceBlocks)
    
            if (filledTiles >= 8 && hasNoWins) {
                console.log("DRAW DETECTED PUG", face, faceBlocks)
                drawFace =  face
                // Check for valid square patterns first
                const validSquares = checkSquarePattern(board);
                console.log(validSquares, "valid Squares")
                if (validSquares.length > 0) {
                    validSquares.forEach(pattern => {
                        console.log(`Square pattern with two X's and two O's detected on face: ${face} | Pattern: ${pattern.join(', ')} | ${dangerZones}`);
                    });
                }
                dangerZones.forEach((zone) => {
                    dangerZone = zone.dangerZone;
                    const minIndex = Math.min(...dangerZone); // Find the smallest number
                    const maxIndex = Math.max(...dangerZone); // Find the biggest number
                    const difference = maxIndex - minIndex;
                
                    if (difference === 1) {
                        // Horizontal danger zone
                        console.log(dangerZone, face, 'Horizontal Danger Zone');
                
                        // Maps to group results by regularFace and newFace
                        const leftResultsGrouped = new Map();
                        const rightResultsGrouped = new Map();
                
                        dangerZone.forEach((number) => {
                            const leftResult = getAdjacentFaceAndNumber(face, "left", number);
                            const rightResult = getAdjacentFaceAndNumber(face, "right", number);
                
                            // Group left results by regularFace and newFace
                            const leftKey = `${face}_${leftResult.newFace}`;
                            if (!leftResultsGrouped.has(leftKey)) {
                                leftResultsGrouped.set(leftKey, {
                                    regularFace: face,
                                    newFace: leftResult.newFace,
                                    numbers: []
                                });
                            }
                            leftResultsGrouped.get(leftKey).numbers.push(number);
                           
                
                            // Group right results by regularFace and newFace
                            const rightKey = `${face}_${rightResult.newFace}`;
                            if (!rightResultsGrouped.has(rightKey)) {
                                rightResultsGrouped.set(rightKey, {
                                    regularFace: face,
                                    newFace: rightResult.newFace,
                                    numbers: []
                                });
                            }
                            rightResultsGrouped.get(rightKey).numbers.push(number);
                
                            //console.log(leftResult, `Processed number ${number} to the left`);
                            //console.log(rightResult, `Processed number ${number} to the right`, rightResultsGrouped.values());
                        });
                
                        groupedLeftResults = Array.from(leftResultsGrouped.values());
                        groupedRightResults = Array.from(rightResultsGrouped.values());
                
                        //console.log("Grouped Left Results:", groupedLeftResults);
                        //console.log("Grouped Right Results:", groupedRightResults);
                
                    } else {
                        // Vertical danger zone
                        console.log(dangerZone, face, 'Vertical Danger Zone');
                
                        // Maps to group results by regularFace and newFace
                        const upResultsGrouped = new Map();
                        const downResultsGrouped = new Map();
                
                        dangerZone.forEach((number) => {
                            const upResult = getAdjacentFaceAndNumber(face, "up", number);
                            const downResult = getAdjacentFaceAndNumber(face, "down", number);
                
                            // Group up results by regularFace and newFace
                            const upKey = `${face}_${upResult.newFace}`;
                            if (!upResultsGrouped.has(upKey)) {
                                upResultsGrouped.set(upKey, {
                                    regularFace: face,
                                    newFace: upResult.newFace,
                                    numbers: []
                                });
                            }
                            upResultsGrouped.get(upKey).numbers.push(number);
                
                            // Group down results by regularFace and newFace
                            const downKey = `${face}_${downResult.newFace}`;
                            if (!downResultsGrouped.has(downKey)) {
                                downResultsGrouped.set(downKey, {
                                    regularFace: face,
                                    newFace: downResult.newFace,
                                    numbers: []
                                });
                            }
                            downResultsGrouped.get(downKey).numbers.push(number);
                
                            console.log(upResult, `Processed number ${number} to the up`);
                            console.log(downResult, `Processed number ${number} to the down`);
                        });
                
                        groupedUpResults = Array.from(upResultsGrouped.values());
                        groupedDownResults = Array.from(downResultsGrouped.values());
                        
                
                        console.log("Grouped Up Results:", groupedUpResults);
                        console.log("Grouped Down Results:", groupedDownResults);
                    }
                });
                
                
    
                // Check for diagonals with 2 O's and suggest a block to change
                const diagonalChange = checkDiagonalForTwoOs(board);
                check2OfSign(board, "X");
                check2OfSign(board, "O");
                console.log(diagonalChange, "diagon ally")
                if (diagonalChange !== null) {
                    adjacentData = [];

                    console.log(`On face ${face}, change block ${diagonalChange} to O to create 3 O's in a diagonal.`);
                    
                    // Call getAdjacentFaceAndNumber and store the result in the adjacentData array
                    adjacentData.push(getAdjacentFaceAndNumber(face, "up", diagonalChange));
                    adjacentData.push(getAdjacentFaceAndNumber(face, "down", diagonalChange));
                    adjacentData.push(getAdjacentFaceAndNumber(face, "left", diagonalChange));
                    adjacentData.push(getAdjacentFaceAndNumber(face, "right", diagonalChange));
                    
                    // Log the stored data
                    console.log("Adjacent Data:", adjacentData);

                    
                    //TODO: this doesn't seem to always work? experiment a bit with the numbers
                } else {
                    console.log(`Draw detected on face: ${face}`);
                }
    
                return true; // Log and handle draw state here if needed
                //TODO: This is a slight problem since if I have 2 draws it doesn't properly register all the time since it gets returned.
            }
        }
        return false;
    }

    

    function checkDiagonalForTwoOs(board) {
        const diagonalPatterns = [
            [0, 4, 8], // Top-left to bottom-right
            [2, 4, 6]  // Top-right to bottom-left
        ];
    
        for (const pattern of diagonalPatterns) {
            // Get the values of the diagonal cells
            const values = pattern.map(index => board[index]);
            const oCount = values.filter(value => value === 'O').length;
    
            // Check if the diagonal has exactly 2 O's
            if (oCount === 2) {
                // Find the cell in the pattern that does NOT contain an 'O'
                const nonOIndex = pattern.find(index => board[index] !== 'O');
                if (nonOIndex !== undefined) {
                    console.log(`Diagonal pattern detected with 2 O's. Block to change: ${nonOIndex}`);
                    return nonOIndex; // Return the index of the block to change
                }
            }
        }
    
        console.log("No valid diagonal with 2 O's found.", board); //If none are found then just play in the dangerzone instead, if there is one (there kind of has to be atleast one, right?)
        return null; // No valid diagonal found
    }
    
    
    
    
    function checkSquarePattern(board) {
        const squarePatterns = [
            [0, 1, 3, 4], // Top-left square
            [1, 2, 4, 5], // Top-right square
            [3, 4, 6, 7], // Bottom-left square
            [4, 5, 7, 8]  // Bottom-right square
        ];
    
        const validSquares = [];
        dangerZones = [];
    
        for (const pattern of squarePatterns) {
            const values = pattern.map(index => board[index]);
            const xCount = values.filter(value => value === 'X').length;
            const oCount = values.filter(value => value === 'O').length;
    
            // A valid square must have exactly 2 X's and 2 O's
            if (xCount === 2 && oCount === 2) {
                // Check for O's adjacency in the square
                const [a, b, c, d] = pattern;
    
                const validOAdjacency = (
                    
                    (values[0] === 'O' && values[1] === 'O') || // O's are adjacent horizontally (top row)
                    (values[2] === 'O' && values[3] === 'O') || // O's are adjacent horizontally (bottom row)
                    (values[0] === 'O' && values[2] === 'O') || // O's are adjacent vertically (left column)
                    (values[1] === 'O' && values[3] === 'O')    // O's are adjacent vertically (right column)
                    
                    
                );
    
                if (validOAdjacency) {
                    validSquares.push(pattern); // Add to the list of valid squares
    
                    // Determine if O's are horizontally or vertically adjacent
                    if (values[0] === 'O' && values[1] === 'O') {
                        console.log("Dangerzoned out 0 out")
                        // O's are horizontally aligned (0, 1), danger zone will be vertical
                        dangerZone = calculateDangerZone(pattern, 'horizontal');
                        dangerZones.push({ square: pattern, dangerZone });
                    } else if (values[1] === 'O' && values[2] === 'O') {
                        console.log("Dangerzoned out 1")
                        // O's are horizontally aligned (1, 2), danger zone will be vertical
                        dangerZone = calculateDangerZone(pattern, 'horizontal');
                        dangerZones.push({ square: pattern, dangerZone });
                    } else if (values[0] === 'O' && values[2] === 'O') {
                        console.log("Dangerzoned out 2")
                        // O's are vertically aligned (0, 3), danger zone will be horizontal
                        const dangerZone = calculateDangerZone(pattern, 'vertical');
                        dangerZones.push({ square: pattern, dangerZone });
                    } else if (values[1] === 'O' && values[3] === 'O') {
                        console.log("Dangerzoned out 3")
                        // O's are vertically aligned (1, 4), danger zone will be horizontal
                        dangerZone = calculateDangerZone(pattern, 'vertical'); //TODO: I think I see the problem, this can either be horizontal or vetical, but it's just usually the lower square, either the left or right one.
                        dangerZones.push({ square: pattern, dangerZone });
                    }  else if (values[2] === 'O' && values[3] === 'O') {
                        console.log("Dangerzoned out 4")
                        // O's are vertically aligned (1, 4), danger zone will be horizontal
                        dangerZone = calculateDangerZone(pattern, 'horizontal');
                        console.log("Fix test", dangerZone)
                        dangerZones.push({ square: pattern, dangerZone });

                    }   else {
                        console.log("Found the problem!", values[0], values [1], values[2], values [3]) //TODO: values [2] and values [3] are  both O, and because of ho this is made it doesn't take that one into acount
                    }
                    
                    dangerZoneCheck = dangerZone
                    console.log("Dangerzoned out", dangerZoneCheck, dangerZone, "valid squares", validSquares, values[0], values [1], values[2], values[3]) //TODO: I think I see the problem? in all essence it's that the valids quares get seen, but they for some reason don't get a dangerzone assigned to them if they are in the lower half?
                }
            }
        }
    
        if (validSquares.length > 0) {
            console.log(`Valid square patterns detected: ${validSquares.map(square => square.join(', ')).join(' | ')}`, dangerZone);
            console.log(dangerZones, `Danger zones detected: ${dangerZones.map(zone => `Square: [${zone.square.join(', ')}], Danger zone: [${zone.dangerZone.join(', ')}]`).join(' | ')}`); //TODO: This does not alway result in dangerzones, research why.
            return { validSquares, dangerZones };
        }
    
        return { validSquares: [], dangerZones: [] };
    }
    
    // Helper function to calculate the danger zone based on square's O-adjacency
    function calculateDangerZone(pattern, direction) {
        const [a, b, c, d] = pattern;
    
        let dangerZone = [];
    
        // If O's are horizontal, danger zone will be vertical (up or down)
        if (direction === 'horizontal') {
            const minIndex = Math.min(a, b, c, d); // Get the minimum index in the square pattern
    
            // Danger zone vertically adjacent to the square (up or down)
            switch (minIndex) {
                case 0:
                    // Move downwards (6, 7 for pattern [0, 1, 3, 4])
                    dangerZone = [2, 5];
                    break;
                case 1:
                    // Move downwards (5, 8 for pattern [1, 2, 4, 5])
                    dangerZone = [0, 3];
                    break;
                case 3:
                    dangerZone = [5, 8];
                    break;
                case 4:
                    // Move downwards (8 for pattern [4, 5, 7, 8])
                    dangerZone = [3, 6];
                    break;
            }
            
        }
    
        // If O's are vertical, danger zone will be horizontal (left or right)
        if (direction === 'vertical') {
            const minIndex = Math.min(a, b, c, d); // Get the minimum index in the square pattern
    
            // Danger zone horizontally adjacent to the square (left or right)
            switch (minIndex) {
                case 0:
                    // Move downwards (6, 7 for pattern [0, 1, 3, 4])
                    dangerZone = [6, 7];
                    break;
                case 1:
                    // Move downwards (5, 8 for pattern [1, 2, 4, 5])
                    dangerZone = [7, 8];
                    break;
                case 3:
                    dangerZone = [0, 1];
                    break;
                case 4:
                    // Move downwards (8 for pattern [4, 5, 7, 8])
                    dangerZone = [1, 2];
                    break;
            }
        }
    
        return dangerZone;
    }
    
    
    
    
    
    
    
    
    
    
   
          
   

    // Switch to the next player
    //humanPlayer = "no test"
    console.log("Test omega init 2")
    checkDrawState() //TODO: For some reason there hve to be two of these for them to properly work, fidd out why
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayer = players[currentPlayerIndex];
    console.log("Next turn: Player", currentPlayer);
    console.log("score update")
    updateScoreboard()
}

function getAdjacentFaceAndNumber(currentFace, direction, number) {
    //TODO: Check out all the faces with all their rotations? Sometimes they are not fully right yet.
    if (currentFace === "bottom") {
        currentFace = "down"
    } else if (currentFace === "top") {
        currentFace = "up"
    }
    // Define the cube's adjacency rules
    const cubeMap = {
        front: { up: "up", down: "down", left: "left", right: "right" },
        back: { up: "up", down: "down", left: "right", right: "left" },
        left: { up: "up", down: "down", left: "back", right: "front" },
        right: { up: "up", down: "down", left: "front", right: "back" },
        up: { up: "back", down: "front", left: "left", right: "right" },
        down: { up: "front", down: "back", left: "left", right: "right" }
    };

    // Get the new face
    const newFace = cubeMap[currentFace]?.[direction];
    //console.log("Current face", currentFace, direction, newFace, mostRecentFace) //TODO: Very very rarely the direction seems to be undefined, leading to more problems right now, currentface front, direction undefined again, leading to mostrecentface also being undefined

    if (!newFace) {
        throw new Error("Invalid face or direction", currentFace, direction); //TODO: For some weird reason, while playing on the bottom and getting a draw, it thinks that "front" is a direction? 
    }

    // Define the transformation logic for the number
    let newNumber;
    switch (true) {
        case (["front", "left", "right", "back"].includes(currentFace) &&
              ["front", "left", "right", "back"].includes(newFace)):
                // If both faces are Front, Left, Right, or Back, carry over the number
                newNumber = number;
                break;
        case (["front", "up", ].includes(currentFace) &&
              ["front", "up"].includes(newFace)):
                // cary over the same number THis one works for frpnt -> up and backwards
                newNumber = number;
                break;
        case (["front", "down", ].includes(currentFace) &&
        ["front", "down"].includes(newFace)):
            // cary over the same number
            newNumber = number;
            break;
        case (["back", "up","down" ].includes(currentFace) &&
            ["back", "up", "down"].includes(newFace)):
            // cary over the same number
            newNumber = (8 - number);
            break;

        case (["left", "right", "down", "up"].includes(currentFace) &&
        ["left", "right", "down", "up"].includes(newFace)):
            if (currentFace === "down" && newFace === "left") {
                newNumber = transformNumber(number, "col", "row", false)
                console.log("Pug82", currentFace, newFace, direction, number, newNumber) //This one seems to work for right -> bottom, but also for bottom -> left
            } else if (newFace === "up" && currentFace === "left" || newFace === "right" && currentFace === "up" || newFace === "right" && currentFace === "down")  {
                    newNumber = transformNumber(number, "col", "row", false) //THis one works for left -> top normally
                    console.log("NewNumberNan", number, newNumber, currentFace, newFace)
            } else if (newFace === "left" && currentFace === "up" || newFace === "up" && currentFace === "right") {
                newNumber = transformNumber(number, "row", "col", false); 
                console.log("NewNumberNan", number, newNumber, currentFace, newFace)
            
                
                
                console.log("TEST", newNumber, currentFace, newFace, direction)
                console.log("Pug83", currentFace, newFace, direction, number, newNumber)
                
            } else if (newFace === "right" && currentFace === "up" || currentFace === "left" && newFace === "down" ) {
                // Handle the "down" direction //THis one seems to work for top -> right  
                newNumber = transformNumber(number, "row", "col", false); 
                console.log("TEST", newNumber, currentFace, newFace)
                console.log("Pug84", currentFace, newFace, direction, number, newNumber)
                
            } else if (newFace === "left" && currentFace === "up" || newFace === "down" && currentFace === "right") {
                newNumber = transformNumber(number, "col", "row", false);
            }
            break;

        
       
        default:
            newNumber = (number + 1) % 9; // Default transformation
            console.log("ERROR", newNumber, number, currentFace, newFace, direction) //TODO: Front down down still triggers this, fix that.
    }
    //console.log("OLD NUMBER", number, "NEW NUMBER", newNumber, currentFace, direction)
    return { newFace, newNumber };
}

// Example usage






function transformNumber(number, swapSource, swapTarget, mirror = false) {
    const grid = [
        [0, 1, 2], // Row 0
        [3, 4, 5], // Row 1
        [6, 7, 8]  // Row 2
    ];

    const flatToGrid = (num) => [Math.floor(num / 3), num % 3]; // Get row and col from number
    const gridToFlat = (row, col) => row * 3 + col;             // Convert row and col back to flat index

    const [row, col] = flatToGrid(number);

    if (swapSource === "row") {
        const targetRow = swapTarget === "row" ? col : 2 - col;
        const targetCol = swapTarget === "col" ? row : row;
        return gridToFlat(mirror ? 2 - targetRow : targetRow, targetCol);
    }

    if (swapSource === "col") {
        const targetRow = swapTarget === "row" ? col : col;
        const targetCol = swapTarget === "col" ? row : 2 - row;
        return gridToFlat(targetRow, mirror ? 2 - targetCol : targetCol);
    }

    return number; // Default: no transformation
}


//TODO: This seems to work perfect for L->U->R->D (if you go up, then first use row, then column, if you go down, first use col and then row)
//TEST this extensively and then implement it aswell



function checkDirectionResults(groupedResults, direction, blockNumber) {
    console.log("dir check!")
    if (groupedResults && direction !== "Invalid input") {
      // Filter groupedResults for entries with matching newFace (direction)
      const matchingResults = groupedResults.filter(result => {
        console.log(`Checking if result.newFace: ${result.newFace.trim()} matches direction: ${direction.trim()}`, result, result.numbers);
        //TODO: right here, make it so that you essentially can translate the numbers, you have to use result.regularFace, result.newFace, and of course a foreach loop for the numbers, essentially you just want to translate them properly.
        result.numbers = result.numbers.map(number => {
            //console.log("Number test, 52", number, direction, getAdjacentFaceAndNumber(result.regularFace, getFaceRelation(result.newFace, result.regularFace).newNumber), result.regularFace, result.newFace);
            const neoNumber = getAdjacentFaceAndNumber(result.regularFace, getFaceRelation(result.regularFace, result.newFace) , number).newNumber; //TODO: this seems to not be working entirely, there is an issue with the system, basically it comes down to the bottom block not correctly seeing the numbers. Same with the top, it doesn't use the proper numbers.
            console.log("Pug Prime. Old number", number, "New number", neoNumber, "54", result.regularFace, result.newFace, getFaceRelation(result.newFace, result.regularFace), getAdjacentFaceAndNumber(result.regularFace, getFaceRelation(result.newFace, result.regularFace) , number).newNumber)
            
            return neoNumber; // Replace the number in the array
        });

        console.log("Pug Prime. 53", result.numbers, direction, blockNumber, groupedResults); //THis seems to work, it should translate the numbers when needed. to make sure everything works well location wise. This is really important for dangerzone recognition.


        return result.newFace.trim() === direction.trim();
      });
  
      console.log("Matching Results:", matchingResults);
  
      // Check if any of the filtered results contains the blockNumber
      const isNumberInResults = matchingResults.some(result => result.numbers.includes(blockNumber));
      console.log("Is Number in Results:", isNumberInResults);
  
      // If a matching result is found
      if (isNumberInResults) {
        // Loop through the matching results and check for the blockNumber
        
        matchingResults.forEach(result => {
          // Check if the blockNumber is one of the numbers
          const otherNumber = result.numbers.find(num => num !== blockNumber);
            const content = document.querySelector(
                `div#${faceToLetter(direction) + otherNumber}.block`
            )
            const contentCheck = content.textContent
          if (result.numbers.includes(blockNumber) && contentCheck === "") {
            
            console.log(`The number ${blockNumber} is in a dangerzone and was chosen. The other number is ${otherNumber} Content: ${contentCheck}.`);
            priorityAi.push({ direction: direction, otherNumber: otherNumber });
          } else {
            console.log("FIX WORKS")
            if (aiUnblockableMove === true) {
                aiUnblockableMove = false
                console.log("Rotation removed")
                rotationData.shift();
            }
          }
        });
      } else {
        console.log(`The number ${blockNumber} is not in a dangerzone here.`, groupedResults, matchingResults, isNumberInResults);
      }
    } else {
      // Handle the case where groupedResults is undefined or direction is invalid
      if (!groupedResults) {
        console.log("groupedResults is undefined or not available.");
      } else {
        console.log("Invalid direction provided, cannot proceed.");
      }
    }
  }

  function getFaceRelation(face1, face2) {
    console.log("Two face" , face1, face2) //TODO: This seems to not work properly, right right in Ai move returns a left rotation? No, works properly, the issue is that it doesn't send a left move, but that is because of how the face system works, in ai move III it should check how the back part gets moved to the right part, while this is not fully the case for some reason?
    const replacements = { top: "up", bottom: "down" };

    face1 = replacements[face1] || face1;
    face2 = replacements[face2] || face2;

    
    console.log(face1, face2);
    //TODO: For the proper rotation logic, convert bottom and top to up and down again, that usually works. Find a way to replace either face 1 or 2 if the result is bottom, and the same for if either result is top.
    const cubeMap = {
        front: { up: "up", down: "down", left: "left", right: "right" },
        back: { up: "up", down: "down", left: "right", right: "left" }, 
        left: { up: "up", down: "down", left: "back", right: "front" },
        right: { up: "up", down: "down", left: "front", right: "back" },
        up: { up: "back", down: "front", left: "left", right: "right" },
        down: { up: "front", down: "back", left: "left", right: "right" }
    };
    // Check if the input faces are valid
    if (!(face1 in cubeMap) || !(face2 in cubeMap)) {
        return "Invalid face";
    }

    // Iterate through the directions of the first face and check if face2 matches any neighbor
    for (const direction in cubeMap[face1]) {
        if (cubeMap[face1][direction] === face2) {
            return direction; // Return the direction relative to face1
        }
    }

    // If no match is found, the faces are not adjacent
    return "faces are not adjacent[", face1, face2;
}
function initializeLimitedSigns() {
    limitedSignsMode = true; //TODO: This one works, make it it's own mode
}
function initializeExponentOverwriteMode() {
    exponentOverwriteMode = true
}

function changesForMajorityToWin(board) {
    const boardValues = board.map(cell => {
        if (typeof cell === 'string' || cell === null) {
            return cell; // Keep as is if already a string or explicitly null
        }
        return cell.innerText !== undefined ? cell.innerText : '';
    });
    //console.log("majority check ", boardValues)
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8]  // Columns
    ];

    const changesForX = [];
    const changesForO = [];
    const parallelConflicts = [];
    const nonConflictingChanges = { changesForX: [], changesForO: [] };

    for (const pattern of winPatterns) {
        const xCount = pattern.filter(index => boardValues[index] === 'X').length;
        const oCount = pattern.filter(index => boardValues[index] === 'O').length;
        const emptySpaces = pattern.filter(index => boardValues[index] === null);
        const otherPlayerSpaces = pattern.filter(index => boardValues[index] === (xCount > oCount ? 'O' : 'X'));

        // If there's a majority holder and one opposing player space
        if (xCount > oCount && otherPlayerSpaces.length === 1) {
            changesForX.push({
                changeBlock: otherPlayerSpaces[0],
                winningPattern: pattern
            });
        } else if (oCount > xCount && otherPlayerSpaces.length === 1) {
            changesForO.push({
                changeBlock: otherPlayerSpaces[0],
                winningPattern: pattern
            });
        }
    }

    // Check for parallel conflicts: rows with changes in the same column or columns with changes in the same row
    for (const changeX of changesForX) {
        for (const changeO of changesForO) {
            const xPatternType = changeX.winningPattern.every(index => Math.floor(index / 3) === Math.floor(changeX.winningPattern[0] / 3)) ? 'row' : 'column';
            const oPatternType = changeO.winningPattern.every(index => Math.floor(index / 3) === Math.floor(changeO.winningPattern[0] / 3)) ? 'row' : 'column';

            if (xPatternType === oPatternType) {
                const isConflict = xPatternType === 'row'
                    ? changeX.changeBlock % 3 === changeO.changeBlock % 3
                    : Math.floor(changeX.changeBlock / 3) === Math.floor(changeO.changeBlock / 3);

                if (isConflict) {
                    parallelConflicts.push({
                        changeForX: changeX,
                        changeForO: changeO
                    });
                }
            }
        }
    }

    // Separate non-conflicting changes
    for (const changeX of changesForX) {
        const isConflicting = parallelConflicts.some(conflict => conflict.changeForX === changeX);
        if (!isConflicting) {
            nonConflictingChanges.changesForX.push(changeX);
        }
    }

    for (const changeO of changesForO) {
        const isConflicting = parallelConflicts.some(conflict => conflict.changeForO === changeO);
        if (!isConflicting) {
            nonConflictingChanges.changesForO.push(changeO);
        }
    }

    // Logging function for cleaner output
    function logResults() {
        console.log("test omega alpha")
    
        if (parallelConflicts.length > 0) {
            console.log("test omega alpha 1")
            parallelConflicts.forEach(({ changeForX, changeForO }, index) => {
                console.log(`Conflict ${index + 1} ${dangerZoneCheck}:`);
                console.log(changeForX.changeBlock, changeForO.changeBlock)
                const changeX = changeForX.changeBlock;
                const changeO = changeForO.changeBlock;
                const otherBlock = findOtherNumber(changeForX.changeBlock, changeForO.changeBlock)
                
                // Determine the bigger and smaller values
                const biggest = Math.max(changeX, changeO);
                const smallest = Math.min(changeX, changeO);
                
                // Calculate the difference
                const difference = biggest - smallest;
                const face = mostRecentFace
                const sharedArray = []
                
                // Check conditions
                
                let directions = ""
                if (difference === 1 || difference === 2) {
                    directions = ["left", "right"];
                    
                } else if (difference === 3 || difference === 6) {
                    //TODO: Although this also triggers for lower vertical danger zones, they do not get defended in the correct way for some reason.
                    //console.log("vertical alter:", difference);
                    directions = ["up", "down"];
                    //TODO: transfer the horizontal code fully below this except for the direction code, then set the direction here to up and down, that way I save on the need of writing extra code.
                }
                directions.forEach((direction) => {
                    console.log("test omega alpha 2", dangerZoneCheck)
                    let XResult = getAdjacentFaceAndNumber(face, direction, changeX);
                    let OResult = getAdjacentFaceAndNumber(face, direction, changeO);
                    //console.log("Direction", direction, XResult, OResult)
            
                    const letter1 = document.querySelector(
                        `div#${faceToLetter(XResult.newFace) + XResult.newNumber}.block`
                    ).textContent;
                    const letter2 = document.querySelector(
                        `div#${faceToLetter(XResult.newFace) + OResult.newNumber}.block`
                    ).textContent;
                    const letter3 = document.querySelector(
                        `div#${faceToLetter(
                            XResult.newFace
                        ) + findOtherNumber(XResult.newNumber, OResult.newNumber)}.block`
                    ).textContent;
            
                    const numberMappings = [
                        { number: changeX, value: letter1 },
                        { number: changeO, value: letter2 },
                        { number: otherBlock, value: letter3 },
                    ];
            
                    const sortedMappings = numberMappings.sort((a, b) => a.number - b.number);
            
                    // Push the corresponding values into the shared array in the sorted order
                    sortedMappings.forEach((mapping) => {
                        sharedArray.push(mapping.value);
                    });
            
                    console.log(sharedArray); // This should normally map them out correctly in the right order
            
                    const modifiedBoard = modifyRowOrColumn(boardValues, "row", determineRowOrColumn(changeX, changeO), sharedArray);
                    sharedArray.length = 0;
                    checkWin(modifiedBoard);
                    //console.log("Board with modified column:", modifiedBoard, modifiedBoard[0], checkWin(modifiedBoard));
                    //console.log(dangerZoneCheck.includes(changeO), dangerZoneCheck, face, "TESTIE") //TODO: For some reason with the dangerzones that don't add up dangerzonecheck is set to false.
                    
                    if (dangerZoneCheck.includes(changeO)) {
                        directions.forEach((direction) => {
                            console.log("test omega alpha 3")
                            
                            
                            const squareInfo = getAdjacentFaceAndNumber(face, direction, changeO)
                            //console.log("Direction", direction, squareInfo)
                            const content = document.querySelector(
                                `div#${faceToLetter(squareInfo.newFace) + squareInfo.newNumber}.block`
                            )
                            const middleContent = document.querySelector(
                                `div#${faceToLetter(squareInfo.newFace) + 4}.block`
                            )
                            const contentCheck = content.textContent
                            if (contentCheck === "" && aiDefense === false && middleTactic === false && middleContent.textContent === "" && rotationData.length === 0 && moveMade === false) {
                                console.log("AI move III", direction, face, content.id, changeO, squareInfo, squareInfo.newFace, getFaceRelation(squareInfo.newFace, face, humanPlayer))
                                content.innerText = "O"
                                //aiDefense = true //TODO: Right now, this keeps going for both directions, I want it to stop at one, so only putting a sign on top or bottom, not both for example
                                moveMade = true;  // Mark that a move has been made
                                aiUnblockableMove = true
                                rotationData.push([
                                    content.id,                           // TODO: Find a way to properly set the block id here, you can't use content.id
                                    getFaceRelation(squareInfo.newFace, face),    // Face relation //TODO: On the back this moves weirdly but now the square info stuff seems to mostly work for a decent setup.
                                    false                                           // skipHistory flag
                                ]);
                                // Switch to the next player
                                //currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                                currentPlayer = players[currentPlayerIndex];
                                console.log("Next turn: Player", currentPlayer);
                                console.log("score update")
                                updateScoreboard()
                                console.log("Test omega delta",face, rotationData, "contentcheck", content, contentCheck, aiDefense, middleTactic, middleContent.textContent, rotationData.length)
                                
                                
                            } else {
                                console.log("Test omega", face, rotationData, "contentcheck", content, contentCheck, aiDefense, middleTactic, middleContent.textContent, rotationData.length)
                            }
                        });
                    }
                    
                });
            });
        } else {
            console.log("  None");
        }

        //console.log("\nNon-Conflicting Changes:");
        //console.log("  Changes for X:");
        //nonConflictingChanges.changesForX.forEach(({ changeBlock, winningPattern }, index) => {
            //console.log(`    ${index + 1}. Change block ${changeBlock} in pattern ${winningPattern}`);
        //});

        //console.log("  Changes for O:");
        //nonConflictingChanges.changesForO.forEach(({ changeBlock, winningPattern }, index) => {
            //console.log(`    ${index + 1}. Change block ${changeBlock} in pattern ${winningPattern}`);
        //});
    }

    logResults();
    //console.log(parallelConflicts, nonConflictingChanges, "POG")

    return {
        parallelConflicts,
        nonConflictingChanges
    };
}

function modifyRowOrColumn(board, type, index, values) {
    const size = 3; // Grid size (3x3)

    if (type === "row") {
        if (values.length !== size) {
            throw new Error(`Row values must have exactly ${size} elements.`);
        }
        
        // Calculate the insertion point
        const startIndex = index * size;

        // Modify the board row with the provided values
        const updatedBoard = [...board];
        for (let i = 0; i < size; i++) {
            updatedBoard[startIndex + i] = values[i] || ""; // Use empty string if no value
        }
        console.log("Pugie", checkWin(updatedBoard))
        return updatedBoard;
    } else if (type === "column") {
        if (values.length !== size) {
            throw new Error(`Column values must have exactly ${size} elements.`);
        }

        // Modify the board column with the provided values
        const updatedBoard = [...board];
        for (let i = 0; i < size; i++) {
            updatedBoard[i * size + index] = values[i] || ""; // Use empty string if no value
        }
        console.log("Pugie", checkWin(updatedBoard))
        return updatedBoard;
    } else {
        throw new Error('Invalid type. Use "row" or "column".');
    }
    
}











function faceToLetter (direction) {
    switch (direction) {
        case "up":
            return 'u'; 
        case "left":
            return 'l';
           
        case "right":
            return 'r';
           
        case "down":
            return 'd'; 
        case "front":
            return 'f';
        case "back":
            return'b';
        case "bottom":
            return 'd'; 
            case "top":
        return 'u'; 
            
        default:
            return "Invalid input";
    }
    
}

function findOtherNumber(number1, number2) {
    // Check if both numbers are in the same row
    if (Math.floor(number1 / 3) === Math.floor(number2 / 3)) {
        // Numbers are in the same row
        const rowStart = Math.floor(number1 / 3) * 3; // Start of the row
        const rowNumbers = [rowStart, rowStart + 1, rowStart + 2];

        // Find the remaining number in the row
        const otherNumber = rowNumbers.find(num => num !== number1 && num !== number2);
        return otherNumber;
    }

    // Check if both numbers are in the same column
    if (number1 % 3 === number2 % 3) {
        // Numbers are in the same column
        const colStart = number1 % 3; // Column index (0, 1, or 2)
        const colNumbers = [colStart, colStart + 3, colStart + 6];

        // Find the remaining number in the column
        const otherNumber = colNumbers.find(num => num !== number1 && num !== number2);
        return otherNumber;
    }

    // If the numbers are not in the same row or column
    throw new Error("The given numbers are not in the same row or column.");
}


//console.log(faceToLetter ("front"))
//console.log(findOtherNumber(0, 3))
//changesForMajorityToWin(board) TODO: check if you need this or not, I'm not sure
function determineRowOrColumn(num1, num2) {
    // Validate inputs
    if (num1 < 0 || num1 > 8 || num2 < 0 || num2 > 8) {
        throw new Error("Numbers must be between 0 and 8 inclusive.");
    }

    // Get rows and columns for each number
    const row1 = Math.floor(num1 / 3);
    const row2 = Math.floor(num2 / 3);

    const col1 = num1 % 3;
    const col2 = num2 % 3;
    console.log(num1, "AAAAAA")

    // Check if both numbers belong to the same row
    if (row1 === row2) {
        return { type: "row", index: row1 };
    }

    // Check if both numbers belong to the same column
    if (col1 === col2) {
        return { type: "column", index: col1 };
    }

    // If they don't belong to the same row or column
    return null;
}

function rotateAi() {
    console.log("rotate ai", rotationData, rotationData.length, aiUnblockableMove, moveMade)
    if (rotationData.length === 1 && aiUnblockableMove === true && moveMade === false) {
        console.log("Defend 2 check", rotationData[0], aiDefense)
        if (document.querySelector(`div#${rotationData[0][0]}.block`).innerText == "O" | aiDefense ) {
            console.log("HE did?", rotationData[0][0])
            // Extract the first entry from the array
            const [id, faceRelation, skipHistory] = rotationData[0];

            // Trigger the function with the extracted values
            getRowOrColumn(id, faceRelation, skipHistory);

            // Remove the first entry from the array after use
            console.log("Rotation removed")
            rotationData.shift();
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            currentPlayer = players[currentPlayerIndex];
            console.log("Next turn: Player", currentPlayer);
            updateScoreboard();
            noBreak = false
            return;
        } else if (document.querySelector(`div#${rotationData[0][0]}.block`).innerText == "") {
            console.log("Player has tried to swipe it away but this revealed an empty block.")
            document.querySelector(`div#${rotationData[0][0]}.block`).innerText = "O"
        }
    } else {
        //moveMade = false
        console.log("Test")
    }
}

console.log(determineRowOrColumn(0, 3))

function nextDirection(current, direction) {
    const arrows = ["right", "down", "left", "up"];
    const reversedArrows = [...arrows].reverse(); // ["up", "left", "down", "right"]
    
    const directions = direction === "clockwise" ? arrows : reversedArrows;

    let index = directions.indexOf(current);
    if (index === -1) return null; // Handle invalid input

    return directions[(index + 1) % directions.length]; // Move forward in the chosen array
}

function evaluateFacePriority() {
        console.log("Evaluating priority EEEEEEEEEEEEEEE")
        //TODO: for some reason this whole system seems to be broken, as a player you can  dupe it quit eeasily in a win for just that face, with the screenshot I took recently.
        //There are mutliple ways this completely breaks down and enables wins for the players, make atleast the on face games solved, as these literally are solved.
        //Also there is stil the bug of it playing pretty much always on the frontface instead of the face that the player actually plays on.
        let priorityList = [];
        const middleIndex = Math.floor(faces[0].length / 2); // Assuming all faces have the same board size
        const middleSquare = faces[0][middleIndex];
        const aiFirstMove = faces.every(face => 
            Array.from(document.querySelectorAll(`.${face} .block`)).every(block => !block.innerText)
        );
    
        // If it's the AI's first move, play in the middle if it's free
        if (aiFirstMove && middleSquare === null) {
            console.log("Middle")
            return { face: faces[0], move: middleIndex }; 
        }
        let allHumanResults = []; // Array to store human results from all faces
        let allAiResults = [];

        for (let face of faces) {
            let faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
            let board = faceBlocks.map(block => block.innerText || null);
            if (face === "front") {
                console.log(face, board, "bobby yo")
            }
            
            const aiResult = { ...minTurnsToWin(board, aiPlayer), face }; //TODO: This doesn't work properly, there is a 0 case in turns, because the  function checks it after the rotation for some reason this function checks right after a rotation in the ai logic, thus leading to it seeing a 0 turns to win move. which is weird.
            const humanResult = { ...minTurnsToWin(board, humanPlayer), face };
        
            // Add the results to the combined array
            console.log("bobby yo", aiResult, board, face)
            allHumanResults.push(humanResult);
            allAiResults.push(aiResult);
        }
        
        // Find the minimum number of turns across all human results
        const minTurnsPlayer = Math.min(...allHumanResults.map(result => result.turns));
        const minTurnsAi = Math.min(...allAiResults.map(result => result.turns));
        
        // Filter the combined results to include only those with the minimum turns
        filteredHumanResults = allHumanResults.filter(result => result.turns === minTurnsPlayer);
        filteredAiResults = allAiResults.filter(result => result.turns === minTurnsAi);
        
        // Log the filtered results with face information
        console.log("Filtered Human Results Across All Faces:", filteredHumanResults, filteredHumanResults[0]);
        console.log("Filtered Ai Results Across All Faces:", filteredAiResults);
        

        for (let face of faces) {
            let faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
            let board = faceBlocks.map(block => block.innerText || null);
    
            const aiResult = minTurnsToWin(board, aiPlayer);
            const humanResult = minTurnsToWin(board, humanPlayer); //This should get the highest proority number of all faces but right now due to how the return fuction etc works it just checks the first face that has signs each time
            console.log("HUMAN TEST", humanResult)
    
            const middleIndex = Math.floor(board.length / 2); // Assuming the board has a single middle square
            const cornerIndices = [0, board.length - 1, Math.sqrt(board.length) - 1, board.length - Math.sqrt(board.length)];
    
            // Check if the player played in a corner and the middle is empty
            if (cornerIndices.some(index => board[index] === humanPlayer) && board[middleIndex] === null && filteredHumanResults[0].turns !== 1) {
                // Prioritize the middle if it's empty
                console.log("Special")
                console.log("no priority list")
                return { face, move: middleIndex };
            }
    
            if (playerMiddle === true) {
                console.log("poglini, player middle", face, blockNumber, "pug") //TODO: The issue seems to be that for some reason this work properly, it think that if you put it anywhere in the middle it should put it in the front.
                // Check if the player can win in one move
                if (filteredHumanResults[0].turns === 1) {
                    // Block the player's winning move
                    playerMiddle = false; // Reset the flag
                    playerMiddleArray = []
                    console.log("Special")
                    console.log("no priority list")
                    return { face, move: humanResult.pattern.find(index => board[index] === null) }; //TODO: This face is not correct
                }
    
                // Otherwise, check for corners
                playerMiddle = false; // Reset the flag
                
                for (const cornerIndex of cornerIndices) {
                    if (board[cornerIndex] === null) {
                        console.log("Special", playerMiddleArray[0])
                        if (playerMiddleArray[0] === "up") {
                            playerMiddleArray[0] = "top";
                        } else if (playerMiddleArray[0] === "down") {
                            playerMiddleArray[0] = "bottom";
                        }
                        
                        face = playerMiddleArray[0]
                        playerMiddleArray = []
                        console.log("no priority list")
                        return { face, move: cornerIndex }; // Pick the first available corner, TODO: because of a mistake right now this always picks the same corner
                    }
                }
                
            }

            if (blockNumber === 5 || blockNumber === 3) {
               
                const content = document.querySelector(
                    `div#${faceToLetter(face) + (blockNumber -3)}.block`
                )
                console.log("Early test to make ai really unbeatable on each individual face.", (blockNumber -3), face, content.textContent, filteredHumanResults[0].turns) 
                if (content.textContent === "" && filteredHumanResults[0].turns !== 1) {
                    return { face, move: (blockNumber - 3) }
                }
                
            }
            if (blockNumber === 7) {
                const block0 = document.querySelector(`div#${faceToLetter(face)}0.block`);
                const block2 = document.querySelector(`div#${faceToLetter(face)}2.block`);
                const block4 = document.querySelector(`div#${faceToLetter(face)}4.block`);
                const lastBlock = document.querySelector(
                    `div#${faceToLetter(face) + (blockNumber - 6)}.block`
                );
            
                // Check if block 4 is either empty or an "O"
                const canSwitch = block4.textContent === "" || block4.textContent === "O";
            
                if (canSwitch) {
                    if (block0.textContent === "O" && block2.textContent === "") {
                        return { face, move: 2 };
                    } else if (block2.textContent === "O" && block0.textContent === "") {
                        return { face, move: 0 };
                    }
                }
            
                // If block 4 prevents switching, or no valid switch found, fill the last block
                if (lastBlock.textContent === "" && filteredHumanResults[0].turns !== 1) {
                    return { face, move: blockNumber - 6 };
                }
            }
            
            

    
            // Check for future winning moves (both 1-turn and 2-turn)
            let blockingMove = null;

            if (filteredAiResults[0].turns === 1 | rotationData.length === 1) {
                console.log("Check, immediate win AI")
                faceBlocks = Array.from(document.querySelectorAll(`.${filteredAiResults[0].face} .block`));
                //board = faceBlocks.map(block => block.innerText || null);
                // AI can win immediately
                console.log("no priority list")
                if (rotationData.length === 1 && filteredAiResults[0].turns > 1) {
                    //TODO: The problem here is that if the ai has a easier win it won't use this, so make it like check if there isn't something where it can win close to instantly.
                    console.log("Rotate ai", rotationData, "faceprioriy")
                    rotateAi()
                } else {
                    console.log("Rotation data length", rotationData.length)
                    return {
                        face: filteredAiResults[0].face, 
                        move: filteredAiResults[0].pattern.find(index => board[index] === null) };
                }
            } else {
                console.log("Fail", rotationData)
            }

            
            if (filteredHumanResults[0].turns === 1) {
                console.log("Check, immediate win player", filteredHumanResults[0])
                // Block immediate winning move
                faceBlocks = Array.from(document.querySelectorAll(`.${filteredHumanResults[0].face} .block`));
                //board = faceBlocks.map(block => block.innerText || null); //TODO: Commenting this out seems to do the trick, otherwise upon the ai rotating it back it wouldn"t see the correct stuff.
                
                blockingMove = filteredHumanResults[0].pattern.find(index => board[index] === null);
                console.log("Special", JSON.stringify(blockingMove), board, face, filteredHumanResults[0], allHumanResults)
            } else if (filteredHumanResults.turns === 2) {
                // Check for future winning move (2 turns)
                faceBlocks = Array.from(document.querySelectorAll(`.${filteredHumanResults[0].face} .block`));
                board = faceBlocks.map(block => block.innerText || null);
                
                blockingMove = filteredHumanResults[0].pattern.find(index => board[index] === null);
                console.log("Special", blockingMove, humanResult)
            }
    
            // If we find a blocking move (either 1-turn or 2-turn threat), block it
            if (blockingMove !== null) {
                console.log("Special")
                return {
                    face: filteredHumanResults[0].face, 
                    move: blockingMove };
            }
    
            // Check if the AI can win in the next move
           
    
            if (filteredHumanResults[0].turns === 1) {
                console.log("Check, immediate win player")
                faceBlocks = Array.from(document.querySelectorAll(`.${filteredHumanResults[0].face} .block`));
                board = faceBlocks.map(block => block.innerText || null);
                // Human can win in one move, block it
                console.log("no priority list")
                return {
                    face: filteredHumanResults[0].face, 
                    move: filteredHumanResults[0].pattern.find(index => board[index] === null) };
            }
    
            // If the human has a 2-turn winning opportunity, prioritize blocking that
            if (filteredHumanResults[0].turns === 2) {
                console.log("Check, incoming win Player")
                // Human can win in two moves, consider blocking
                faceBlocks = Array.from(document.querySelectorAll(`.${filteredHumanResults[0].face} .block`));
                board = faceBlocks.map(block => block.innerText || null);
                //console.log("Potentially hard move to stop? put on a adjacent face, be warned, this can be undefined so you'll have to keep that in mind aswell" ,changesForMajorityToWin(board).nonConflictingChanges.changesForO[0]?.changeBlock)
                return { 
                    face: filteredHumanResults[0].face, 
                    move: filteredHumanResults[0].pattern.find(index => board[index] === null),
                }
               
            }
    
            // If the AI has a 2-turn winning opportunity, prioritize setting up that win
            if (filteredAiResults.turns === 2) {
                console.log("Check, incoming win AI")
                // AI can win in two moves, consider setting up
                faceBlocks = Array.from(document.querySelectorAll(`.${filteredAiResults[0].face} .block`));
                board = faceBlocks.map(block => block.innerText || null);
                return { 
                    face: filteredAiResults[0].face, 
                    move: filteredAiResults[0].pattern.find(index => board[index] === null),
                }
            }
        }
    
        // Sort by priority (higher priority first)
        //priorityList.sort((a, b) => b.priority - a.priority);
    
        // Return the highest priority move
        console.log("Priority puggy", priorityList)
        filteredHumanResults = []
        filteredAiResults = []
        return priorityList.length > 0 ? priorityList[0] : null;
    }

    function minTurnsToWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        console.log("MINTURNS TRIGGERED")


        let minTurns = Infinity;
        let winningPattern = [];
        for (let face of faces) {
            let faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
            let board = faceBlocks.map(block => block.innerText || null);

            for (const pattern of winPatterns) {
                const playerMoves = pattern.filter(index => board[index] === player).length;
                const emptySpaces = pattern.filter(index => board[index] === null).length;

                if (playerMoves + emptySpaces === 3) {
                    if (emptySpaces < minTurns) {
                        minTurns = emptySpaces;
                        if (player === "O") {
                            console.log("Minturns test ", minTurns, board, player)
                        }
                        if (minTurns === 1) {
                            console.log("Minturns test", minTurns, board, player) //Potentially this returns no 1 for the ai because it makes a move before? check that out.
                        }
                            winningPattern = pattern;
                    }
                }
            }

            
        }
        return minTurns === Infinity ? { turns: -1, pattern: [] } : { turns: minTurns, pattern: winningPattern };
    }
        

    function check2OfSign(board, sign) {
        let foundPatterns = [];
    
        for (const pattern of winPatterns) {
            // Get the values of the cells in the pattern
            let values = pattern.map(index => board[index]);
            let signCount = values.filter(value => value === sign).length;
    
            // Check if the pattern has exactly 2 of the sign
            if (signCount === 2) {
                // Find the cell in the pattern that is NOT the sign
                const nonSignIndex = pattern.find(index => board[index] !== sign);
                if (nonSignIndex !== undefined) {
                    //console.log(`Pattern detected with 2 ${sign}'s. Block to change: ${nonSignIndex}, Pattern: ${pattern}, Values: ${values}`);
                    foundPatterns.push(nonSignIndex);
                }
            }
        }
    
        if (foundPatterns.length > 0) {
            return foundPatterns; // Return all found indices
        }
    
        console.log("No valid pattern with 2 of the sign found.", board);
        return null; // No valid pattern found
    }
    

