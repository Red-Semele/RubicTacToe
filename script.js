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


function updateBlockColors(layers) {
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

    // Update the color of each block based on its letter
    allBlocks.forEach(block => {
        const letter = block.innerText; // Get the letter
        block.style.backgroundColor = colorMap[letter] || 'transparent'; // Set color
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




// Modify rotateLayers function to incorporate saving and restoring the column
function rotateLayers(layers, type, columnIndex = null) {
    
    
    let{ frontLayer, backLayer, leftLayer, rightLayer, topLayer, bottomLayer } = layers;

    if (type === 'row') {
        // Store current row state
        const tempFront = frontLayer.map(block => block.innerText);
        tempBack = backLayer.map(block => block.innerText);
        const tempLeft = leftLayer.map(block => block.innerText);
        const tempRight = rightLayer.map(block => block.innerText);

        // Rotate the row (front <-> back, left <-> right)
        frontLayer.forEach((block, index) => {
            block.innerText = leftLayer[index].innerText;
        });
        leftLayer.forEach((block, index) => {
            block.innerText = backLayer[index].innerText;
        });
        backLayer.forEach((block, index) => {
            block.innerText = rightLayer[index].innerText;
        });
        rightLayer.forEach((block, index) => {
            block.innerText = tempFront[index];
        });
    } else if (type === 'column') {
        // Save the column from the back layer before rotating
        saveBackLayerColumn(columnIndex);
        

        // Store current column state
        const tempFront = frontLayer.map(block => block.innerText);
        tempBack = backLayer.map(block => block.innerText); 
        const tempTop = topLayer.map(block => block.innerText);
        const tempBottom = bottomLayer.map(block => block.innerText);
        console.log("Pugaroonie", savedBackLayer, "EE",  backLayer, "AA", tempBack) 
        
        // Rotate the column (top <-> bottom, front <-> back)

        frontLayer.forEach((block, index) => {
            block.innerText = topLayer[index].innerText;
        });

        console.log("Back Layer MOPS:", backLayer.map(block => block.innerText));

        backLayer.forEach((block, index) => {
            block.innerText = bottomLayer[2 - index].innerText;
        }); 

        
        console.log("Back Layer MOPS:", backLayer.map(block => block.innerText));
        
        console.log("Top Layer MOPS:", topLayer.map(block => block.innerText) + topLayer + tempBack);
        console.log("THROW it back WAAAY before", backLayer, tempBack)
       
        console.log("Top Layer MOPS:", topLayer.map(block => block.innerText));

        // Swap columns in trueBackLayer only if needed
        if (columnIndex === 0 || columnIndex === 2) {
            
    
            // Determine the opposite column: if 0, we want column 2; if 2, we want column 0
            const oppositeColumnIndex = columnIndex === 0 ? 2 : (columnIndex === 2 ? 0 : columnIndex);
        
            // Filter the blocks to only include those in the opposite column
            const oppositeColumnBlocks = tempBack.filter((_, index) => index % 3 === oppositeColumnIndex);
        
            // Log the selected blocks for debugging
            console.log(`Opposite column ${oppositeColumnIndex} for columnIndex ${columnIndex}:`, oppositeColumnBlocks);
               
               
                console.log("THROW it back before", backLayer);
                backLayer = trueBackLayer;
                console.log("THROW it back after", backLayer); 
                topLayer.forEach((block, index) => {
                    block.innerText = tempBack[2 - index]; 
                });
        } else {
            topLayer.forEach((block, index) => {
                block.innerText = tempBack[2 - index]; 
            });
        }


        bottomLayer.forEach((block, index) => {
            block.innerText = tempFront[index];
        });

        // Restore the saved column in the back layer
        
    }

    // Update the colors of the blocks after rotation
    updateBlockColors(layers);
}

// The rest of your code remains the same.









