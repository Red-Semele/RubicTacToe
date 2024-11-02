const cube = document.getElementById('cube');
let rotationX = 0; // Initial rotation on X-axis
let rotationY = 0; // Initial rotation on Y-axis
let tempBack = ""
let trueBackLayer = ""

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








function rotateLayers(layers, type, columnIndex = null) {
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
        console.log(columnIndex + "PUG")
        if (columnIndex == 2) {
            rotateFace('bottom', 'clockwise');
            
            
        } else if (columnIndex == 0) {
                rotateFace('top', 'clockwise');
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
        if (columnIndex == 2) {
            rotateFace('right', 'counterclockwise');
            
            
        } else if (columnIndex == 0) {
                rotateFace('left', 'clockwise');
            }
    }

   

    // Check for a win immediately after rotating
    

    // Update the colors of the blocks after rotation
    updateBlockColors(); // Call this function to apply the background colors
    
}

// Variable to keep track of the current player ("X" or "O")

let xTotalWins = 0; // Total wins for player X
let oTotalWins = 0; // Total wins for player O

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

function updateScoreboard() {
    document.getElementById('xWins').innerText = `X Wins: ${xTotalWins}`;
    document.getElementById('oWins').innerText = `O Wins: ${oTotalWins}`;
}

function checkCubeWin() {
    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    const overallWinners = new Map(); // Use a Map to track counts of winners per symbol
    const faceWinners = {}; // Object to keep track of winners per face
    
    for (let face of faces) {
        // Get all blocks in the current face
        const faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
        
        // Check for a win on this face
        const winners = checkWin(faceBlocks);
        
        if (winners.length > 0) {
            // Count the winners
            winners.forEach(winner => {
                overallWinners.set(winner, (overallWinners.get(winner) || 0) + 1);
            });
            faceWinners[face] = winners; // Store winners for the current face
        }
    }

    // Determine if there's a balanced outcome or a draw
    if (overallWinners.size > 0) {
        const xWins = overallWinners.get("X") || 0;
        const oWins = overallWinners.get("O") || 0;

        // If both players have the same number of wins, it's a draw
        if (xWins === oWins) {
            console.log("It's a draw! Game continues."); // Feedback for a draw
            return; // Exit without announcing a winner
        }

        // If there are winners, calculate the total wins for the winner
        let winner, loser, winnerCount, loserCount;

        if (xWins > oWins) {
            winner = "X";
            loser = "O";
            winnerCount = xWins;
            loserCount = oWins;
            xTotalWins += (winnerCount - loserCount); // Update total wins for X
        } else {
            winner = "O";
            loser = "X";
            winnerCount = oWins;
            loserCount = xWins;
            oTotalWins += (winnerCount - loserCount); // Update total wins for O
        }

        // Update the scoreboard
        updateScoreboard();

        setTimeout(() => {
            // Create a message for the winning player
            const winnerMessage = `${winner} wins! Total wins adjusted to ${winnerCount - loserCount}.`;
            alert(winnerMessage);
            
            // Optional: reset the game after announcing the winner
            resetGame(); 
        }, 50); // Delay of 50 milliseconds
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

    currentPlayer = "X"; // Reset to starting player

    // Reset scoreboard display
    document.getElementById('xWins').innerText = 'X Wins: 0';
    document.getElementById('oWins').innerText = 'O Wins: 0';
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


function getRowOrColumn(blockId, direction) {
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

    // Handle the rotation based on direction and face
    switch (angle) {
        case "horizontal":
            console.log("HORE");
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
                            rotateSColumn(row); // Call row function with the row number
                            console.log(`Rotated column ${row} on face ${face} clockwise`);
                            break;
                        case 'left':
                            for (let i = 0; i < 3; i++) {
                                rotateSColumn(row); // Counterclockwise
                            }
                            console.log(`Rotated column ${row} on face ${face} counterclockwise`);
                            break;
                    }
                    break;

                default:
                    console.log(`Swipe direction ${direction} on face ${face} is not handled.`);
            }
            break;

        case "vertical":
            console.log("Erti");
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
                            rotateSColumn(mirroredCol);
                            console.log(`Rotated column ${mirroredCol} on face ${face} clockwise`);
                            break;
                        case 'up':
                            for (let i = 0; i < 3; i++) {
                                rotateSColumn(mirroredCol); // Counterclockwise
                            }
                            console.log(`Rotated column ${mirroredCol} on face ${face} counterclockwise`);
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
    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch to the other player
    checkCubeWin();
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

let startBlock = null;
let startX = 0;
let startY = 0;
let currentPlayer = "X"; // Track the current player

// Handle mousedown or touchstart to capture start position and coordinates
function handleBlockStart(event) {
    event.preventDefault(); // Prevent default drag behavior

    const isTouch = event.type === "touchstart";
    const eventInfo = isTouch ? event.touches[0] : event;

    startBlock = event.target;    // Set the start block where start occurred
    startX = eventInfo.clientX;   // Capture the initial X coordinate
    startY = eventInfo.clientY;   // Capture the initial Y coordinate
    console.log("Interaction started on:", startBlock.id, "at coordinates:", startX, startY);
}

// Handle mouseup or touchend to detect if the swipe finished on a different block and direction
function handleBlockEnd(event) {
    const isTouch = event.type === "touchend";
    const eventInfo = isTouch ? event.changedTouches[0] : event;
    
    const endBlock = document.elementFromPoint(eventInfo.clientX, eventInfo.clientY); // Get block where end occurred

    // If start and end block are the same, treat as a click
    if (startBlock === endBlock) {
        handleBlockClick(event); // Call the click handler
    } else {
        // Extract block numbers from IDs
        const startBlockNumber = parseInt(startBlock.id[1]);
        const endBlockNumber = parseInt(endBlock.id[1]);

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

    startBlock = null; // Reset start block for the next drag
}

// Handle the click to place the player's mark
function handleBlockClick(event) {
    const block = event.target;

    // Only set the text if the block is empty
    if (!block.innerText) {
        block.innerText = currentPlayer; // Set current player's symbol
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch to the other player
        
        // Check for a win after each move
        checkCubeWin();
    }
}

// Add event listeners for both mouse and touch events on each block
document.querySelectorAll('.block').forEach(block => {
    // Mouse events
    block.addEventListener('mousedown', handleBlockStart);
    block.addEventListener('mouseup', handleBlockEnd);

    // Touch events
    block.addEventListener('touchstart', handleBlockStart);
    block.addEventListener('touchend', handleBlockEnd);
});











