document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const flowersLeftDisplay = document.getElementById('flowers-left');
    const flowerPalette = document.querySelector('.flower-palette');
    const resetButton = document.getElementById('reset-button');

    const BOARD_SIZE = 5; // Tablero de 5x5
    let board = []; // Representación interna del tablero
    let score = 0;
    let flowersLeft = 5;
    let selectedFlower = null; // La flor actualmente seleccionada para plantar

    // Definición de las flores con sus propiedades
    const FLOWER_TYPES = {
        rose: {
            symbol: '🌹',
            baseValue: 5,
            effect: (row, col, currentBoard) => {
                let bonus = 0;
                // Busca girasoles adyacentes
                getAdjacentCells(row, col).forEach(([r, c]) => {
                    if (currentBoard[r] && currentBoard[r][c] === 'sunflower') {
                        bonus += 2; // +2 si está junto a un girasol
                    }
                });
                return bonus;
            }
        },
        tulip: {
            symbol: '🌷',
            baseValue: 3,
            effect: (row, col, currentBoard) => {
                let penalty = 0;
                // Busca girasoles adyacentes
                getAdjacentCells(row, col).forEach(([r, c]) => {
                    if (currentBoard[r] && currentBoard[r][c] === 'sunflower') {
                        penalty -= 1; // -1 si está junto a un girasol
                    }
                });
                return penalty;
            }
        },
        sunflower: {
            symbol: '🌻',
            baseValue: 2,
            effect: (row, col, currentBoard) => {
                let bonus = 0;
                // Gana +1 por cada flor adyacente
                getAdjacentCells(row, col).forEach(([r, c]) => {
                    if (currentBoard[r] && currentBoard[r][c]) { // Si hay algo plantado
                        bonus += 1;
                    }
                });
                return bonus;
            }
        }
    };

    // Inicializa el tablero del juego y las variables
    function initializeGame() {
        board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        score = 0;
        flowersLeft = 5;
        selectedFlower = null;
        updateDisplay();
        renderBoard();
        updateFlowerPaletteSelection();
        gameBoard.classList.remove('game-over'); // Asegura que el tablero no esté deshabilitado
    }

    // Renderiza el tablero en el HTML
    function renderBoard() {
        gameBoard.innerHTML = ''; // Limpia el tablero existente
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (board[r][c]) {
                    cell.classList.add('planted');
                    cell.textContent = FLOWER_TYPES[board[r][c]].symbol;
                } else {
                    cell.addEventListener('click', handleCellClick);
                }
                gameBoard.appendChild(cell);
            }
        }
    }

    // Actualiza la visualización de la puntuación y flores restantes
    function updateDisplay() {
        scoreDisplay.textContent = score;
        flowersLeftDisplay.textContent = flowersLeft;
    }

    // Actualiza la selección visual en la paleta de flores
    function updateFlowerPaletteSelection() {
        document.querySelectorAll('.flower-item').forEach(item => {
            if (item.dataset.flower === selectedFlower) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Manejador de clics en las celdas del tablero
    function handleCellClick(event) {
        if (flowersLeft <= 0 || !selectedFlower) return; // No se puede plantar si no quedan flores o no hay flor seleccionada

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (board[row][col] === null) { // Solo si la celda está vacía
            board[row][col] = selectedFlower; // Plantar la flor
            flowersLeft--;
            calculateScore(); // Recalcular la puntuación
            renderBoard(); // Volver a renderizar el tablero para mostrar la flor
            updateDisplay();

            if (flowersLeft === 0) {
                endGame();
            }
        }
    }

    // Manejador de clics en la paleta de flores
    function handleFlowerPaletteClick(event) {
        selectedFlower = event.target.dataset.flower;
        updateFlowerPaletteSelection();
    }

    // Calcula la puntuación total del tablero
    function calculateScore() {
        let newScore = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const flowerType = board[r][c];
                if (flowerType) {
                    const flower = FLOWER_TYPES[flowerType];
                    newScore += flower.baseValue; // Sumar valor base
                    newScore += flower.effect(r, c, board); // Sumar efecto de adyacencia
                }
            }
        }
        score = newScore;
    }

    // Obtiene las coordenadas de las celdas adyacentes (arriba, abajo, izquierda, derecha)
    function getAdjacentCells(row, col) {
        const adjacent = [];
        // Arriba
        if (row > 0) adjacent.push([row - 1, col]);
        // Abajo
        if (row < BOARD_SIZE - 1) adjacent.push([row + 1, col]);
        // Izquierda
        if (col > 0) adjacent.push([row, col - 1]);
        // Derecha
        if (col < BOARD_SIZE - 1) adjacent.push([row, col + 1]);
        return adjacent;
    }

    // Finaliza el juego
    function endGame() {
        alert(`¡Juego Terminado! Tu puntuación final es: ${score}`);
        gameBoard.classList.add('game-over'); // Deshabilita interacciones
    }

    // Event Listeners
    flowerPalette.querySelectorAll('.flower-item').forEach(item => {
        item.addEventListener('click', handleFlowerPaletteClick);
    });

    resetButton.addEventListener('click', initializeGame);

    // Iniciar el juego al cargar la página
    initializeGame();
});