
/* =========================================
   CHESS ACADEMY
   Lecciones, movimientos y ejercicios
========================================= */

const pieces = {

    king: {
        name: "El rey",
        symbol: "♔",
        description:
            "El rey puede moverse una casilla en cualquier dirección: hacia adelante, atrás, a los lados o en diagonal.",
        tip:
            "El rey nunca puede moverse a una casilla donde pueda ser capturado.",
        practice:
            "Selecciona el rey y luego una casilla verde. El rey se mueve una casilla en cualquier dirección."
    },

    queen: {
        name: "La reina",
        symbol: "♕",
        description:
            "La reina puede moverse tantas casillas como quiera en línea recta, horizontal, vertical o diagonal.",
        tip:
            "La reina combina los movimientos de la torre y el alfil.",
        practice:
            "Selecciona la reina y muévela en horizontal, vertical o diagonal."
    },

    rook: {
        name: "La torre",
        symbol: "♖",
        description:
            "La torre se mueve en línea recta: horizontalmente o verticalmente. Puede avanzar varias casillas.",
        tip:
            "La torre no puede moverse en diagonal ni saltar sobre otras piezas.",
        practice:
            "Selecciona la torre y muévela horizontal o verticalmente."
    },

    bishop: {
        name: "El alfil",
        symbol: "♗",
        description:
            "El alfil se mueve diagonalmente tantas casillas como quiera.",
        tip:
            "Cada alfil permanece siempre en casillas del mismo color.",
        practice:
            "Selecciona el alfil y muévelo en diagonal."
    },

    knight: {
        name: "El caballo",
        symbol: "♘",
        description:
            "El caballo se mueve en forma de L: dos casillas en una dirección y una hacia un lado.",
        tip:
            "El caballo es la única pieza que puede saltar sobre otras piezas.",
        practice:
            "Selecciona el caballo y muévelo en forma de L."
    },

    pawn: {
        name: "El peón",
        symbol: "♙",
        description:
            "El peón avanza una casilla hacia adelante. En su primer movimiento puede avanzar dos. Captura en diagonal.",
        tip:
            "El peón no captura hacia adelante. Cuando llega al final del tablero, puede coronarse.",
        practice:
            "En este ejercicio, el peón avanza una casilla hacia adelante."
    }

};


/* =========================================
   ELEMENTOS HTML
========================================= */

const pieceTitle = document.getElementById("piece-title");
const pieceDescription = document.getElementById("piece-description");
const pieceTip = document.getElementById("piece-tip");
const miniBoard = document.getElementById("mini-board");

const practiceBoard = document.getElementById("practice-board");
const practiceTitle = document.getElementById("practice-title");
const practiceDescription = document.getElementById("practice-description");
const feedback = document.getElementById("feedback");

const piecePracticeButton =
    document.getElementById("piece-practice-btn");

const resetBoardButton =
    document.getElementById("reset-board");

const quizQuestion =
    document.getElementById("quiz-question");

const quizOptions =
    document.getElementById("quiz-options");

const quizFeedback =
    document.getElementById("quiz-feedback");

const quizNext =
    document.getElementById("quiz-next");

const quizCount =
    document.getElementById("quiz-count");

const quizScore =
    document.getElementById("quiz-score");

const progressFill =
    document.getElementById("progress-fill");


/* =========================================
   VARIABLES
========================================= */

let currentPiece = "king";

let practicePosition = {
    row: 4,
    col: 3
};

let selectedSquare = false;

let quizIndex = 0;
let score = 0;
let answered = false;


/* =========================================
   MOVIMIENTOS
========================================= */

/*
    El tablero utiliza:

    row = fila
    col = columna

    Fila 0 = parte superior
    Fila 7 = parte inferior

    Columna 0 = izquierda
    Columna 7 = derecha

    Las blancas avanzan hacia arriba.
*/

function getMoves(piece, row, col) {

    const moves = [];

    function addMove(r, c) {

        if (
            r >= 0 &&
            r < 8 &&
            c >= 0 &&
            c < 8
        ) {
            moves.push({
                row: r,
                col: c
            });
        }

    }


    // REY
    if (piece === "king") {

        for (let dr = -1; dr <= 1; dr++) {

            for (let dc = -1; dc <= 1; dc++) {

                if (dr === 0 && dc === 0) {
                    continue;
                }

                addMove(
                    row + dr,
                    col + dc
                );

            }

        }

    }


    // CABALLO
    if (piece === "knight") {

        const directions = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1]
        ];

        directions.forEach(([dr, dc]) => {

            addMove(
                row + dr,
                col + dc
            );

        });

    }


    // PEÓN
    if (piece === "pawn") {

        // Avanza una casilla hacia arriba
        addMove(
            row - 1,
            col
        );

    }


    // TORRE, ALFIL Y REINA
    if (
        piece === "rook" ||
        piece === "bishop" ||
        piece === "queen"
    ) {

        let directions = [];

        // Vertical y horizontal
        if (
            piece === "rook" ||
            piece === "queen"
        ) {

            directions.push(
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1]
            );

        }

        // Diagonales
        if (
            piece === "bishop" ||
            piece === "queen"
        ) {

            directions.push(
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1]
            );

        }


        directions.forEach(([dr, dc]) => {

            let r = row + dr;
            let c = col + dc;

            while (
                r >= 0 &&
                r < 8 &&
                c >= 0 &&
                c < 8
            ) {

                addMove(r, c);

                r += dr;
                c += dc;

            }

        });

    }


    return moves;

}


/* =========================================
   DIBUJAR TABLERO
========================================= */

function drawBoard(
    boardElement,
    piece,
    position,
    showMoves = true,
    interactive = false
) {

    boardElement.innerHTML = "";

    const moves = showMoves
        ? getMoves(
            piece,
            position.row,
            position.col
        )
        : [];


    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square =
                document.createElement("button");

            square.type = "button";

            square.className =
                "square " +
                (
                    (row + col) % 2 === 0
                        ? "light"
                        : "dark"
                );


            const isPiece =
                row === position.row &&
                col === position.col;


            const isMove =
                moves.some(move =>
                    move.row === row &&
                    move.col === col
                );


            if (isPiece) {

                square.innerHTML =
                    `<span class="piece">${pieces[piece].symbol}</span>`;

            }


            if (isMove) {

                square.classList.add("move-target");

            }


            if (isPiece && interactive) {

                square.classList.add("selected");

            }


            if (interactive) {

                square.addEventListener(
                    "click",
                    () => handlePracticeClick(
                        row,
                        col
                    )
                );

            }


            boardElement.appendChild(square);

        }

    }

}


/* =========================================
   LECCIONES DE PIEZAS
========================================= */

function showPieceLesson(piece) {

    currentPiece = piece;

    const data = pieces[piece];

    pieceTitle.textContent = data.name;

    pieceDescription.textContent =
        data.description;

    pieceTip.textContent =
        data.tip;


    document.querySelectorAll(".piece-card")
        .forEach(card => {

            card.classList.toggle(
                "active",
                card.dataset.piece === piece
            );

        });


    /*
        Colocamos la pieza en el centro
        del tablero de ejemplo.
    */

    const position = {
        row: 3,
        col: 3
    };


    drawBoard(
        miniBoard,
        piece,
        position,
        true,
        false
    );

}


/* =========================================
   CAMBIAR PIEZA DE PRÁCTICA
========================================= */

function selectPracticePiece(piece) {

    currentPiece = piece;

    practicePosition = {
        row: 4,
        col: 3
    };

    selectedSquare = false;

    practiceTitle.textContent =
        "Practica con " +
        pieces[piece].name.toLowerCase();

    practiceDescription.textContent =
        pieces[piece].practice;

    feedback.textContent =
        "Selecciona la pieza y luego una casilla verde.";

    document.querySelectorAll(".selector-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.piece === piece
            );

        });


    drawPracticeBoard();

}


/* =========================================
   TABLERO DE PRÁCTICA
========================================= */

function drawPracticeBoard() {

    drawBoard(
        practiceBoard,
        currentPiece,
        practicePosition,
        true,
        true
    );

}


/* =========================================
   INTERACCIÓN CON EL TABLERO
========================================= */

function handlePracticeClick(row, col) {

    /*
        Si selecciona la posición actual,
        se muestra un mensaje.
    */

    if (
        row === practicePosition.row &&
        col === practicePosition.col
    ) {

        selectedSquare = true;

        feedback.textContent =
            "¡Muy bien! Ahora elige una casilla verde.";

        drawPracticeBoard();

        return;

    }


    const moves = getMoves(
        currentPiece,
        practicePosition.row,
        practicePosition.col
    );


    const isValid = moves.some(move =>
        move.row === row &&
        move.col === col
    );


    if (isValid) {

        practicePosition = {
            row: row,
            col: col
        };

        selectedSquare = false;

        feedback.textContent =
            "¡Correcto! Ese movimiento es válido. " +
            "Puedes seguir practicando.";

        drawPracticeBoard();

    } else {

        feedback.textContent =
            "Esa casilla no corresponde a un movimiento " +
            "válido para esta pieza. Prueba con una verde.";

    }

}


/* =========================================
   REINICIAR EJERCICIO
========================================= */

function resetPractice() {

    practicePosition = {
        row: 4,
        col: 3
    };

    selectedSquare = false;

    feedback.textContent =
        "Ejercicio reiniciado. ¡Inténtalo de nuevo!";

    drawPracticeBoard();

}


/* =========================================
   QUIZ
========================================= */

const questions = [

    {
        question:
            "¿Qué pieza se mueve en forma de L?",

        options: [
            "La torre",
            "El caballo",
            "El alfil",
            "El rey"
        ],

        answer: 1,

        explanation:
            "¡Correcto! El caballo se mueve dos casillas " +
            "en una dirección y una hacia un lado."
    },

    {
        question:
            "¿Cómo se mueve el alfil?",

        options: [
            "En línea recta horizontal",
            "Solo una casilla",
            "En diagonal",
            "En forma de L"
        ],

        answer: 2,

        explanation:
            "¡Bien! El alfil se mueve en diagonal."
    },

    {
        question:
            "¿Qué pieza debes proteger principalmente?",

        options: [
            "El rey",
            "El caballo",
            "La torre",
            "El peón"
        ],

        answer: 0,

        explanation:
            "¡Correcto! El objetivo es dar jaque mate al rey rival."
    },

    {
        question:
            "¿Cómo captura el peón?",

        options: [
            "Hacia adelante",
            "En diagonal",
            "En forma de L",
            "En cualquier dirección"
        ],

        answer: 1,

        explanation:
            "¡Exacto! El peón avanza hacia adelante " +
            "y captura en diagonal."
    },

    {
        question:
            "¿Qué significa jaque mate?",

        options: [
            "El rey puede moverse libremente",
            "La partida acaba en empate",
            "El rey está amenazado y no puede escapar",
            "Se captura una torre"
        ],

        answer: 2,

        explanation:
            "¡Muy bien! El jaque mate significa que " +
            "el rey está amenazado y no tiene ninguna " +
            "jugada legal para escapar."
    }

];


/* =========================================
   MOSTRAR PREGUNTA
========================================= */

function showQuestion() {

    answered = false;

    quizFeedback.textContent = "";

    quizNext.disabled = true;

    const question = questions[quizIndex];


    quizCount.textContent =
        `Pregunta ${quizIndex + 1} de ${questions.length}`;

    quizScore.textContent =
        `Puntos: ${score}`;

    progressFill.style.width =
        `${(quizIndex / questions.length) * 100}%`;


    quizQuestion.textContent =
        question.question;

    quizOptions.innerHTML = "";


    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.className = "quiz-option";

        button.textContent = option;


        button.addEventListener(
            "click",
            () => answerQuestion(
                index,
                button
            )
        );


        quizOptions.appendChild(button);

    });

}


/* =========================================
   RESPONDER QUIZ
========================================= */

function answerQuestion(index, button) {

    if (answered) {
        return;
    }

    answered = true;

    const question = questions[quizIndex];

    const allOptions =
        quizOptions.querySelectorAll(
            ".quiz-option"
        );


    allOptions.forEach(option => {

        option.disabled = true;

    });


    if (index === question.answer) {

        score++;

        button.classList.add("correct");

        quizFeedback.textContent =
            question.explanation;

    } else {

        button.classList.add("wrong");

        allOptions[question.answer]
            .classList.add("correct");

        quizFeedback.textContent =
            "No pasa nada. " +
            question.explanation;

    }


    quizScore.textContent =
        `Puntos: ${score}`;

    quizNext.disabled = false;

}


/* =========================================
   SIGUIENTE PREGUNTA
========================================= */

function nextQuestion() {

    if (quizIndex >= questions.length) {
        restartQuiz();
        return;
    }

    quizIndex++;

    if (quizIndex >= questions.length) {

        quizQuestion.textContent =
            "¡Has terminado el quiz!";

        quizOptions.innerHTML = "";

        quizFeedback.textContent =
            `Tu puntuación final es ${score} de ${questions.length}. ` +
            (
                score === questions.length
                    ? "¡Excelente! Dominas los conceptos básicos."
                    : "¡Sigue practicando y vuelve a intentarlo!"
            );

        quizNext.textContent =
            "Volver a jugar";

        quizNext.disabled = false;

        progressFill.style.width = "100%";

        return;
    }

    showQuestion();

}


/* =========================================
   REINICIAR QUIZ
========================================= */

function restartQuiz() {

    quizIndex = 0;

    score = 0;

    quizNext.textContent =
        "Siguiente pregunta →";

    quizNext.onclick =
        nextQuestion;

    showQuestion();

}


/* =========================================
   EVENTOS
========================================= */

// Tarjetas de piezas
document.querySelectorAll(".piece-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                showPieceLesson(
                    card.dataset.piece
                );

            }
        );

    });


// Botón de práctica de la lección
piecePracticeButton.addEventListener(
    "click",
    () => {

        selectPracticePiece(
            currentPiece
        );

        document.getElementById("practica")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// Selector de piezas en el tablero
document.querySelectorAll(".selector-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectPracticePiece(
                    button.dataset.piece
                );

            }
        );

    }
);


// Reiniciar tablero
resetBoardButton.addEventListener(
    "click",
    resetPractice
);


// Quiz
quizNext.addEventListener(
    "click",
    nextQuestion
);


/* =========================================
   INICIALIZAR PÁGINA
========================================= */

showPieceLesson("king");

selectPracticePiece("king");

showQuestion();

/* =====================================
   CHESS ACADEMY - BOT DE AJEDREZ
===================================== */


/* =====================================
   CHESS ACADEMY - BOT DE AJEDREZ
===================================== */

const botGame = new Chess();

const botBoard = document.getElementById("bot-board");
const botLevel = document.getElementById("bot-level");
const botName = document.getElementById("bot-name");
const botDescription = document.getElementById("bot-description");
const botPlayerName = document.getElementById("bot-player-name");
const gameStatus = document.getElementById("game-status");
const moveHistoryList = document.getElementById("move-history-list");
const newGameButton = document.getElementById("new-game");

let botSelectedSquare = null;
let botLegalMoves = [];
let botThinking = false;
let botLastMove = null;
let gameOver = false;

const chessSymbols = {
    wk: "♔", wq: "♕", wr: "♖",
    wb: "♗", wn: "♘", wp: "♙",
    bk: "♚", bq: "♛", br: "♜",
    bb: "♝", bn: "♞", bp: "♟"
};

const pieceValues = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000
};


/* =====================================
   BOTÓN DESHACER
===================================== */

const undoButton = document.createElement("button");

undoButton.type = "button";
undoButton.id = "undo-game";
undoButton.className = "undo-game-button";
undoButton.textContent = "↶ Deshacer movimiento";

newGameButton.parentElement.appendChild(undoButton);

undoButton.addEventListener("click", undoLastTurn);


/* =====================================
   PERFIL Y DIFICULTAD
===================================== */

function updateBotProfile() {

    const profiles = {
        easy: {
            name: "Bot Principiante",
            description: "Un rival tranquilo para aprender y practicar."
        },

        medium: {
            name: "Bot Estratega",
            description: "Analiza capturas, jaques y el valor de las piezas."
        },

        hard: {
            name: "Bot Maestro",
            description: "Analiza posibles respuestas antes de decidir su jugada."
        }
    };

    const profile = profiles[botLevel.value];

    botName.textContent = profile.name;
    botPlayerName.textContent = profile.name;
}

botLevel.addEventListener("change", () => {
    updateBotProfile();
    startNewBotGame();
});


/* =====================================
   DIBUJAR TABLERO
===================================== */

function renderBotBoard() {

    botBoard.innerHTML = "";

    const board = botGame.board();

    const history = botGame.history({
        verbose: true
    });

    const lastMove = history.length
        ? history[history.length - 1]
        : null;

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square = document.createElement("button");

            square.type = "button";

            square.className =
                "square " +
                ((row + col) % 2 === 0 ? "light" : "dark");

            const squareName = "abcdefgh"[col] + (8 - row);
            const piece = board[row][col];

            if (piece) {

                const pieceElement = document.createElement("span");

                pieceElement.className =
                    "piece " + (piece.color === "b" ? "black" : "");

                pieceElement.textContent =
                    chessSymbols[piece.color + piece.type];

                square.appendChild(pieceElement);
            }

            if (squareName === botSelectedSquare) {
                square.classList.add("selected");
            }

            if (
                lastMove &&
                (squareName === lastMove.from ||
                 squareName === lastMove.to)
            ) {
                square.classList.add("last-move");
            }

            const legalMove = botLegalMoves.find(
                move => move.to === squareName
            );

            if (legalMove) {

                const destinationPiece = botGame.get(squareName);

                square.classList.add(
                    destinationPiece ? "bot-capture" : "bot-legal"
                );
            }

            square.addEventListener("click", () => {
                handleBotSquareClick(squareName);
            });

            botBoard.appendChild(square);
        }
    }

    updateMoveHistory();
}


/* =====================================
   SELECCIÓN DE PIEZAS
===================================== */

function handleBotSquareClick(squareName) {

    if (
        botThinking ||
        botGame.game_over() ||
        botGame.turn() !== "w"
    ) {
        return;
    }

    if (botSelectedSquare) {

        const selectedMove = botLegalMoves.find(
            move => move.to === squareName
        );

        if (selectedMove) {
            makeHumanMove(botSelectedSquare, squareName);
            return;
        }
    }

    const selectedPiece = botGame.get(squareName);

    if (selectedPiece && selectedPiece.color === "w") {

        botSelectedSquare = squareName;

        botLegalMoves = botGame.moves({
            square: squareName,
            verbose: true
        });

        renderBotBoard();

        gameStatus.textContent =
            "Elige una casilla disponible para mover tu pieza.";

    } else {

        botSelectedSquare = null;
        botLegalMoves = [];

        renderBotBoard();
    }
}


/* =====================================
   MOVIMIENTO DEL JUGADOR
===================================== */

function makeHumanMove(from, to) {

    const move = botGame.move({
        from,
        to,
        promotion: "q"
    });

    if (!move) return;

    botSelectedSquare = null;
    botLegalMoves = [];

    renderBotBoard();
    updateGameStatus();

    if (!botGame.game_over()) {

        botThinking = true;

        gameStatus.textContent = "El bot está pensando...";

        setTimeout(makeBotMove, 500);
    }
}


/* =====================================
   EVALUACIÓN DEL TABLERO
===================================== */

function evaluateBoard() {

    if (botGame.in_checkmate()) {
        return botGame.turn() === "b" ? -100000 : 100000;
    }

    if (botGame.in_draw()) {
        return 0;
    }

    let score = 0;

    const board = botGame.board();

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = board[row][col];

            if (!piece) continue;

            let value = pieceValues[piece.type];

            // Pequeña bonificación por ocupar el centro.
            if (
                (row === 3 || row === 4) &&
                (col === 3 || col === 4)
            ) {
                value += 15;
            }

            score += piece.color === "b" ? value : -value;
        }
    }

    return score;
}


/* =====================================
   BÚSQUEDA DE JUGADAS
===================================== */

function minimax(depth, alpha, beta) {

    if (depth === 0 || botGame.game_over()) {
        return evaluateBoard();
    }

    const moves = botGame.moves({
        verbose: true
    });

    const maximizing = botGame.turn() === "b";

    let bestScore = maximizing ? -Infinity : Infinity;

    for (const move of moves) {

        botGame.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || "q"
        });

        const score = minimax(depth - 1, alpha, beta);

        botGame.undo();

        if (maximizing) {

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);

        } else {

            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, bestScore);
        }

        if (beta <= alpha) break;
    }

    return bestScore;
}


/* =====================================
   ELEGIR MOVIMIENTO DEL BOT
===================================== */

function chooseBotMove() {

    const moves = botGame.moves({
        verbose: true
    });

    if (!moves.length) return null;

    const level = botLevel.value;

    // NIVEL PRINCIPIANTE
    if (level === "easy") {

        return moves[
            Math.floor(Math.random() * moves.length)
        ];
    }

    // NIVEL ESTRATEGA
    if (level === "medium") {

        const scoredMoves = moves.map(move => {

            let score = 0;

            if (move.captured) {
                score += pieceValues[move.captured];
            }

            if (move.promotion) {
                score += 800;
            }

            botGame.move({
                from: move.from,
                to: move.to,
                promotion: move.promotion || "q"
            });

            if (botGame.in_checkmate()) {
                score += 100000;
            } else if (botGame.in_check()) {
                score += 50;
            }

            botGame.undo();

            return { move, score };
        });

        scoredMoves.sort((a, b) => b.score - a.score);

        const bestScore = scoredMoves[0].score;

        const bestMoves = scoredMoves.filter(
            item => item.score === bestScore
        );

        return bestMoves[
            Math.floor(Math.random() * bestMoves.length)
        ].move;
    }

    // NIVEL MAESTRO
    let bestMove = null;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const move of moves) {

        botGame.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || "q"
        });

        const score = minimax(2, alpha, beta);

        botGame.undo();

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }

        alpha = Math.max(alpha, bestScore);
    }

    return bestMove;
}


/* =====================================
   TURNO DEL BOT
===================================== */

function makeBotMove() {

    if (botGame.game_over()) {

        botThinking = false;
        updateGameStatus();

        return;
    }

    const move = chooseBotMove();

    if (move) {

        botGame.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || "q"
        });
    }

    botThinking = false;

    renderBotBoard();
    updateGameStatus();
}


/* =====================================
   ESTADO DE LA PARTIDA
===================================== */

function updateGameStatus() {

    if (botGame.in_checkmate()) {

        gameOver = true;

        gameStatus.textContent =
            botGame.turn() === "w"
                ? "¡Jaque mate! El bot ha ganado."
                : "¡JAQUE MATE! ¡Has ganado la partida!";

        return;
    }

    if (botGame.in_stalemate()) {

        gameOver = true;
        gameStatus.textContent =
            "¡Tablas! La partida terminó en ahogado.";

        return;
    }

    if (botGame.in_draw()) {

        gameOver = true;
        gameStatus.textContent =
            "La partida terminó en tablas.";

        return;
    }

    if (botGame.in_check()) {

        gameStatus.textContent =
            botGame.turn() === "w"
                ? "¡Cuidado! Tu rey está en jaque."
                : "¡El bot está en jaque!";

        return;
    }

    gameStatus.textContent =
        botGame.turn() === "w"
            ? "¡Tu turno! Mueve una pieza blanca."
            : "Turno del bot. Está pensando...";
}


/* =====================================
   HISTORIAL
===================================== */

function updateMoveHistory() {

    const history = botGame.history();

    if (!history.length) {

        moveHistoryList.textContent =
            "Todavía no hay movimientos.";

        return;
    }

    let html = "";

    for (let i = 0; i < history.length; i += 2) {

        const turn = Math.floor(i / 2) + 1;

        html += `
            <div class="move-row">
                <strong>${turn}.</strong>
                <span>${history[i] || ""}</span>
                <span>${history[i + 1] || ""}</span>
            </div>
        `;
    }

    moveHistoryList.innerHTML = html;
}


/* =====================================
   DESHACER MOVIMIENTO
===================================== */

function undoLastTurn() {

    if (botThinking) return;

    if (botGame.history().length === 0) {
        gameStatus.textContent = "Todavía no hay movimientos para deshacer.";
        return;
    }

    // Deshacer primero la jugada del bot, si existe.
    if (botGame.turn() === "w" && botGame.history().length >= 2) {
        botGame.undo();
        botGame.undo();
    } else {
        botGame.undo();
    }

    botSelectedSquare = null;
    botLegalMoves = [];
    gameOver = false;

    renderBotBoard();
    updateGameStatus();
}


/* =====================================
   NUEVA PARTIDA
===================================== */

function startNewBotGame() {

    botGame.reset();

    botSelectedSquare = null;
    botLegalMoves = [];
    botThinking = false;
    gameOver = false;

    updateBotProfile();

    renderBotBoard();

    gameStatus.textContent =
        "¡Nueva partida! Tú juegas con las blancas. ¡Comienza!";
}

newGameButton.addEventListener("click", startNewBotGame);


/* =====================================
   INICIALIZAR
===================================== */

updateBotProfile();
startNewBotGame();
