const cube = document.getElementById('cube');
let isDragging = false;
let startX, startY;
const dragThreshold = 10; // Minimum drag distance before triggering a twist
let dragDirection = null; // Track the drag direction
let selectedRow = null; // Track the selected row
let selectedCol = null; // Track the selected column
let currentPlayer = 'X'; // Start with player X

// Initialize the state of the cube
let cubeState = [
    ["", "", "", "", "", "", "", "", ""],   // Front
    ["", "", "", "", "", "", "", "", ""], // Back
    ["", "", "", "", "", "", "", "", ""], // Right
    ["", "", "", "", "", "", "", "", ""], // Left
    ["", "", "", "", "", "", "", "", ""], // Top
    ["", "", "", "", "", "", "", "", ""] // Bottom
];

// Initialize the colors of the cube
let cubeColors = [
    ["red", "red", "red", "red", "red", "red", "red", "red", "red"], // Front
    ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"], // Back
    ["green", "green", "green", "green", "green", "green", "green", "green", "green"], // Right
    ["orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"], // Left
    ["white", "white", "white", "white", "white", "white", "white", "white", "white"], // Top
    ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"] // Bottom
];


// Cube rotation angles
let rotateX = 0;
let rotateY = 0;

// Function to rotate the cube based on keyboard input
function rotateCube() {
    cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

// Keyboard event for cube rotation
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            rotateX -= 15;
            break;
        case 'ArrowDown':
            rotateX += 15;
            break;
        case 'ArrowLeft':
            rotateY -= 15;
            break;
        case 'ArrowRight':
            rotateY += 15;
            break;
    }
    rotateCube();
});

// Function to rotate the cube based on mouse drag
function handleMouseMove(e) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Determine if dragging is more horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Check if the drag distance exceeds the threshold
        if (Math.abs(deltaX) > dragThreshold) {
            dragDirection = deltaX > 0 ? 'row-right' : 'row-left';
            if (selectedRow !== null) {
                twistRow(dragDirection, selectedRow);
            }
            startX = e.clientX; // Reset start position for next move
        }
    } else {
        // Check if the drag distance exceeds the threshold
        if (Math.abs(deltaY) > dragThreshold) {
            dragDirection = deltaY > 0 ? 'column-down' : 'column-up';
            if (selectedCol !== null) {
                twistColumn(dragDirection, selectedCol);
            }
            startY = e.clientY; // Reset start position for next move
        }
    }
}

// Mouse down event to start dragging
cube.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault(); // Prevent text selection

    // Determine which square was clicked
    const squareSize = 50; // Size of each square (150 / 3)
    const x = Math.floor((e.clientX - cube.offsetLeft) / squareSize);
    const y = Math.floor((e.clientY - cube.offsetTop) / squareSize);

    // Determine selected row or column based on square clicked
    if (y === 0 || y === 1 || y === 2) {
        selectedRow = y; // Set selected row based on square
    }
    if (x === 0 || x === 1 || x === 2) {
        selectedCol = x; // Set selected column based on square
    }
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
    isDragging = false;
    dragDirection = null; // Reset drag direction
    selectedRow = null; // Reset selected row
    selectedCol = null; // Reset selected column
});

// Mouse move event
document.addEventListener('mousemove', handleMouseMove);

// Function to twist a specific row
function twistRow(direction, rowIndex) {
    if (direction === 'row-right') {
        // Twist the selected row of the cube to the right
        const tempState = cubeState[0].slice(rowIndex * 3, rowIndex * 3 + 3);
        const tempColors = cubeColors[0].slice(rowIndex * 3, rowIndex * 3 + 3);

        // Update `cubeState` positions
        cubeState[0].splice(rowIndex * 3, 3, ...cubeState[3].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeState[3].splice(rowIndex * 3, 3, ...cubeState[2].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeState[2].splice(rowIndex * 3, 3, ...cubeState[1].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeState[1].splice(rowIndex * 3, 3, ...tempState);

        // Update `cubeColors` positions
        cubeColors[0].splice(rowIndex * 3, 3, ...cubeColors[3].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeColors[3].splice(rowIndex * 3, 3, ...cubeColors[2].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeColors[2].splice(rowIndex * 3, 3, ...cubeColors[1].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeColors[1].splice(rowIndex * 3, 3, ...tempColors);
    } else {
        // Twist the selected row of the cube to the left
        const tempState = cubeState[0].slice(rowIndex * 3, rowIndex * 3 + 3);
        const tempColors = cubeColors[0].slice(rowIndex * 3, rowIndex * 3 + 3);

        // Update `cubeState` positions
        cubeState[0].splice(rowIndex * 3, 3, ...cubeState[2].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeState[2].splice(rowIndex * 3, 3, ...cubeState[1].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeState[1].splice(rowIndex * 3, 3, ...cubeState[3].slice(rowIndex * 3, rowIndex * 3 + 3).reverse());
        cubeState[3].splice(rowIndex * 3, 3, ...tempState);

        // Update `cubeColors` positions
        cubeColors[0].splice(rowIndex * 3, 3, ...cubeColors[2].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeColors[2].splice(rowIndex * 3, 3, ...cubeColors[1].slice(rowIndex * 3, rowIndex * 3 + 3));
        cubeColors[1].splice(rowIndex * 3, 3, ...cubeColors[3].slice(rowIndex * 3, rowIndex * 3 + 3).reverse());
        cubeColors[3].splice(rowIndex * 3, 3, ...tempColors);
    }
    updateCube();
}
// Function to twist a specific column
function twistColumn(direction, colIndex) {
    if (direction === 'column-down') {
        // Twist the selected column of the cube down
        const tempState = [cubeState[0][colIndex], cubeState[0][colIndex + 3], cubeState[0][colIndex + 6]];
        const tempColors = [cubeColors[0][colIndex], cubeColors[0][colIndex + 3], cubeColors[0][colIndex + 6]];

        // Update `cubeState` positions
        [cubeState[0][colIndex], cubeState[0][colIndex + 3], cubeState[0][colIndex + 6]] = [cubeState[4][colIndex], cubeState[4][colIndex + 3], cubeState[4][colIndex + 6]];
        [cubeState[4][colIndex], cubeState[4][colIndex + 3], cubeState[4][colIndex + 6]] = [cubeState[1][colIndex], cubeState[1][colIndex + 3], cubeState[1][colIndex + 6]];
        [cubeState[1][colIndex], cubeState[1][colIndex + 3], cubeState[1][colIndex + 6]] = [cubeState[5][colIndex], cubeState[5][colIndex + 3], cubeState[5][colIndex + 6]];
        [cubeState[5][colIndex], cubeState[5][colIndex + 3], cubeState[5][colIndex + 6]] = tempState;

        // Update `cubeColors` positions
        [cubeColors[0][colIndex], cubeColors[0][colIndex + 3], cubeColors[0][colIndex + 6]] = [cubeColors[4][colIndex], cubeColors[4][colIndex + 3], cubeColors[4][colIndex + 6]];
        [cubeColors[4][colIndex], cubeColors[4][colIndex + 3], cubeColors[4][colIndex + 6]] = [cubeColors[1][colIndex], cubeColors[1][colIndex + 3], cubeColors[1][colIndex + 6]];
        [cubeColors[1][colIndex], cubeColors[1][colIndex + 3], cubeColors[1][colIndex + 6]] = [cubeColors[5][colIndex], cubeColors[5][colIndex + 3], cubeColors[5][colIndex + 6]];
        [cubeColors[5][colIndex], cubeColors[5][colIndex + 3], cubeColors[5][colIndex + 6]] = tempColors;
    } else {
        // Twist the selected column of the cube up
        const tempState = [cubeState[0][colIndex], cubeState[0][colIndex + 3], cubeState[0][colIndex + 6]];
        const tempColors = [cubeColors[0][colIndex], cubeColors[0][colIndex + 3], cubeColors[0][colIndex + 6]];

        // Update `cubeState` positions
        [cubeState[0][colIndex], cubeState[0][colIndex + 3], cubeState[0][colIndex + 6]] = [cubeState[5][colIndex], cubeState[5][colIndex + 3], cubeState[5][colIndex + 6]];
        [cubeState[5][colIndex], cubeState[5][colIndex + 3], cubeState[5][colIndex + 6]] = [cubeState[1][colIndex], cubeState[1][colIndex + 3], cubeState[1][colIndex + 6]];
        [cubeState[1][colIndex], cubeState[1][colIndex + 3], cubeState[1][colIndex + 6]] = [cubeState[4][colIndex], cubeState[4][colIndex + 3], cubeState[4][colIndex + 6]];
        [cubeState[4][colIndex], cubeState[4][colIndex + 3], cubeState[4][colIndex + 6]] = tempState;

        // Update `cubeColors` positions
        [cubeColors[0][colIndex], cubeColors[0][colIndex + 3], cubeColors[0][colIndex + 6]] = [cubeColors[5][colIndex], cubeColors[5][colIndex + 3], cubeColors[5][colIndex + 6]];
        [cubeColors[5][colIndex], cubeColors[5][colIndex + 3], cubeColors[5][colIndex + 6]] = [cubeColors[1][colIndex], cubeColors[1][colIndex + 3], cubeColors[1][colIndex + 6]];
        [cubeColors[1][colIndex], cubeColors[1][colIndex + 3], cubeColors[1][colIndex + 6]] = [cubeColors[4][colIndex], cubeColors[4][colIndex + 3], cubeColors[4][colIndex + 6]];
        [cubeColors[4][colIndex], cubeColors[4][colIndex + 3], cubeColors[4][colIndex + 6]] = tempColors;
    }
    updateCube();
}


// Function to update the visual representation of the cube
function updateCube() {
    const faces = cube.children;

    for (let i = 0; i < faces.length; i++) {
        const squares = faces[i].children;
        for (let j = 0; j < squares.length; j++) {
            // Update text to show X or O based on cubeState
            if (cubeState[i][j]) {
                squares[j].innerText = cubeState[i][j];
            } else {
                squares[j].innerText = '';
            }
            
            // Set text color for X and O
            squares[j].style.color = cubeState[i][j] === 'X' ? 'white' : 'black';

            // Set the background color based on cubeColors
            squares[j].style.backgroundColor = cubeColors[i][j];
        }
    }
}


// Function to check for win conditions
function checkWin() {
    const winConditions = [
        // Check rows and columns on each face
        ...Array.from({ length: 6 }, (_, faceIndex) => {
            const face = cubeState[faceIndex];
            return [
                [face[0], face[1], face[2]],
                [face[3], face[4], face[5]],
                [face[6], face[7], face[8]],
                [face[0], face[3], face[6]],
                [face[1], face[4], face[7]],
                [face[2], face[5], face[8]]
            ];
        })
    ].flat();

    for (const condition of winConditions) {
        if (condition[0] && condition[0] === condition[1] && condition[1] === condition[2]) {
            setTimeout(() => alert(`${condition[0]} wins!`), 10);
            resetGame();
            return;
        }
    }

    if (cubeState.flat().every(square => square)) {
        setTimeout(() => alert("It's a draw!"), 10);
        resetGame();
    }
}

// Function to reset the game
function resetGame() {
    cubeState = [
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
    ];
    updateCube();
    currentPlayer = 'X'; // Reset to player X
}

// Event listener for clicking on squares to place X or O
const faces = cube.children;
for (let i = 0; i < faces.length; i++) {
    const squares = faces[i].children;
    for (let j = 0; j < squares.length; j++) {
        squares[j].addEventListener('click', () => {
            if (!cubeState[i][j]) { // Check if the square is empty
                cubeState[i][j] = currentPlayer; // Mark the square with current player's symbol
                updateCube();
                checkWin(); // Check for a win after the move
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch players
            }
        });
    }
}