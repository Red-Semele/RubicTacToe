const cube = document.getElementById('cube');
let rotationX = 30; // Initial rotation on X-axis
let rotationY = 30; // Initial rotation on Y-axis
let tempBack = ""
let trueBackLayer = ""

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
    rotateLayers(layers, 'row');
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






// Variable to keep track of the current player ("X" or "O")
let currentPlayer = "X";
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

// Function to check for a win on a given face
function checkWin(faceBlocks) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        // Check if all three blocks in the combination have the same non-empty value
        if (faceBlocks[a].innerText &&
            faceBlocks[a].innerText === faceBlocks[b].innerText &&
            faceBlocks[a].innerText === faceBlocks[c].innerText) {
            return faceBlocks[a].innerText; // Return the winning symbol ("X" or "O")
        }
    }
    return null; // No win found on this face
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
    }

    // Check for a win immediately after rotating
    

    // Update the colors of the blocks after rotation
    updateBlockColors(); // Call this function to apply the background colors
    checkCubeWin();
}

// Ensure checkCubeWin is immediately effective
function checkCubeWin() {
    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    
    for (let face of faces) {
        // Get all blocks in the current face
        const faceBlocks = Array.from(document.querySelectorAll(`.${face} .block`));
        
        // Check for a win on this face
        const winner = checkWin(faceBlocks);
        
        if (winner) {
            alert(`${winner} wins on the ${face} face!`);
            resetGame(); // Optional: reset the game after a win
            return; // Exit once a win is found
        }
    }
}


// Reset function to clear the game board
function resetGame() {
    const allBlocks = document.querySelectorAll('.block');
    allBlocks.forEach(block => {
        block.innerText = ''; // Clear inner text
        block.setAttribute('data-color', ''); // Clear color if needed
    });
    currentPlayer = "X"; // Reset to starting player
}

// Update handleBlockClick to include win check
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
    checkCubeWin();
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
    checkCubeWin();
}





// Event listeners for the new buttons



// Start the Tic-Tac-Toe game
initializeTicTacToe();









