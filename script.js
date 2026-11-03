
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

const chessSymbols = {
    wk: "♔",
    wq: "♕",
    wr: "♖",
    wb: "♗",
    wn: "♘",
    wp: "♙",

    bk: "♚",
    bq: "♛",
    br: "♜",
    bb: "♝",
    bn: "♞",
    bp: "♟"
};

const pieceValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 100
};


/* =====================================
   CONFIGURAR BOT
===================================== */

function updateBotProfile() {

    const level = botLevel.value;

    const profiles = {

        easy: {
            name: "Bot Principiante",
            description: "Un rival para comenzar a practicar."
        },

        medium: {
            name: "Bot Estratega",
            description: "Busca capturas y movimientos de ataque."
        },

        hard: {
            name: "Bot Maestro",
            description: "Intenta encontrar jugadas más valiosas."
        }

    };

    const profile = profiles[level];

    botName.textContent = profile.name;
    botPlayerName.textContent = profile.name;
    botDescription.textContent = profile.description;

}

botLevel.addEventListener("change", updateBotProfile);


/* =====================================
   DIBUJAR TABLERO COMPLETO
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
                (
                    (row + col) % 2 === 0
                        ? "light"
                        : "dark"
                );

            const file = "abcdefgh"[col];
            const rank = 8 - row;

            const squareName = file + rank;

            const piece = board[row][col];

            if (piece) {

                const symbol =
                    chessSymbols[piece.color + piece.type];

                const pieceElement =
                    document.createElement("span");

                pieceElement.className =
                    "piece " +
                    (
                        piece.color === "b"
                            ? "black"
                            : ""
                    );

                pieceElement.textContent = symbol;

                square.appendChild(pieceElement);

            }


            if (squareName === botSelectedSquare) {
                square.classList.add("selected");
            }


            if (
                lastMove &&
                (
                    squareName === lastMove.from ||
                    squareName === lastMove.to
                )
            ) {
                square.classList.add("last-move");
            }


            const isLegalMove =
                botLegalMoves.find(
                    move => move.to === squareName
                );

            if (isLegalMove) {

                const destinationPiece =
                    botGame.get(squareName);

                square.classList.add(
                    destinationPiece
                        ? "bot-capture"
                        : "bot-legal"
                );

            }


            square.addEventListener(
                "click",
                () => handleBotSquareClick(squareName)
            );

            botBoard.appendChild(square);

        }

    }

    updateMoveHistory();

}


/* =====================================
   SELECCIONAR Y MOVER PIEZAS
===================================== */

function handleBotSquareClick(squareName) {

    if (
        botThinking ||
        botGame.game_over() ||
        botGame.turn() !== "w"
    ) {
        return;
    }


    // Si ya hay una pieza seleccionada,
    // comprobamos si puede moverse a esta casilla.

    if (botSelectedSquare) {

        const selectedMove =
            botLegalMoves.find(
                move => move.to === squareName
            );

        if (selectedMove) {

            makeHumanMove(
                botSelectedSquare,
                squareName
            );

            return;

        }

    }


    // Seleccionar una pieza blanca.

    const selectedPiece =
        botGame.get(squareName);

    if (
        selectedPiece &&
        selectedPiece.color === "w"
    ) {

        botSelectedSquare = squareName;

        botLegalMoves = botGame.moves({
            square: squareName,
            verbose: true
        });

        renderBotBoard();

        gameStatus.textContent =
            "Elige una casilla verde para realizar tu movimiento.";

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

    try {

        const move = botGame.move({
            from: from,
            to: to,
            promotion: "q"
        });

        if (!move) {
            return;
        }

        botSelectedSquare = null;
        botLegalMoves = [];

        renderBotBoard();
        updateGameStatus();

        if (!botGame.game_over()) {

            botThinking = true;

            gameStatus.textContent =
                "El bot está pensando...";

            setTimeout(() => {

                makeBotMove();

            }, 650);

        }

    } catch (error) {

        console.error("Error al realizar el movimiento:", error);

    }

}


/* =====================================
   INTELIGENCIA DEL BOT
===================================== */

function chooseBotMove() {

    const moves = botGame.moves({
        verbose: true
    });

    if (!moves.length) {
        return null;
    }

    const level = botLevel.value;


    // PRINCIPIANTE: movimientos aleatorios.

    if (level === "easy") {

        return moves[
            Math.floor(Math.random() * moves.length)
        ];

    }


    // ESTRATEGA Y MAESTRO:
    // Evalúan capturas, jaques y promociones.

    const scoredMoves = moves.map(move => {

        let score = 0;

        // Valor de las piezas capturadas.
        if (move.captured) {

            score +=
                pieceValues[move.captured] * 10;

        }


        // Promocionar un peón es muy valioso.
        if (move.promotion) {

            score += 80;

        }


        // Comprobamos si la jugada da jaque.
        botGame.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || "q"
        });

        if (botGame.in_checkmate()) {

            score += 10000;

        } else if (botGame.in_check()) {

            score += level === "hard" ? 12 : 5;

        }

        botGame.undo();


        // El nivel maestro valora el control central.
        if (level === "hard") {

            const centralSquares = [
                "c3", "d3", "e3", "f3",
                "c4", "d4", "e4", "f4",
                "c5", "d5", "e5", "f5",
                "c6", "d6", "e6", "f6"
            ];

            if (centralSquares.includes(move.to)) {
                score += 2;
            }

        }

        return {
            move: move,
            score: score
        };

    });


    scoredMoves.sort(
        (a, b) => b.score - a.score
    );


    // Entre las mejores jugadas se elige una al azar
    // para que el bot no repita siempre el mismo patrón.

    const bestScore = scoredMoves[0].score;

    const bestMoves = scoredMoves.filter(
        item => item.score === bestScore
    );

    return bestMoves[
        Math.floor(Math.random() * bestMoves.length)
    ].move;

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

        if (botGame.turn() === "w") {

            gameStatus.textContent =
                "¡Jaque mate! El bot ha ganado esta partida.";

        } else {

            gameStatus.textContent =
                "¡JAQUE MATE! ¡Has ganado la partida!";

        }

        return;

    }


    if (botGame.in_stalemate()) {

        gameStatus.textContent =
            "¡Tablas! La partida terminó en ahogado.";

        return;

    }


    if (botGame.in_draw()) {

        gameStatus.textContent =
            "La partida terminó en tablas.";

        return;

    }


    if (botGame.in_check()) {

        gameStatus.textContent =
            "¡Jaque! Tu rey está amenazado.";

        return;

    }


    if (botGame.turn() === "w") {

        gameStatus.textContent =
            "¡Tu turno! Mueve una pieza blanca.";

    } else {

        gameStatus.textContent =
            "Turno del bot. Está pensando...";

    }

}


/* =====================================
   HISTORIAL DE MOVIMIENTOS
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

        const turnNumber = Math.floor(i / 2) + 1;

        const whiteMove = history[i] || "";
        const blackMove = history[i + 1] || "";

        html += `
            <div>
                <strong>${turnNumber}.</strong>
                ${whiteMove}
                &nbsp; ${blackMove}
            </div>
        `;

    }

    moveHistoryList.innerHTML = html;

}


/* =====================================
   NUEVA PARTIDA
===================================== */

function startNewBotGame() {

    botGame.reset();

    botSelectedSquare = null;
    botLegalMoves = [];

    botThinking = false;

    updateBotProfile();

    renderBotBoard();

    gameStatus.textContent =
        "¡Nueva partida! Tú juegas con las blancas. ¡Comienza!";

}

newGameButton.addEventListener(
    "click",
    startNewBotGame
);


/* =====================================
   INICIAR JUEGO
===================================== */

updateBotProfile();

startNewBotGame();
