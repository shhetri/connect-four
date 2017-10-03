// IFFE to prevent populating global namespace
(function () {
    // Has some configuration values
    var config = {
        redPlayer: "red",
        blackPlayer: "black",
        nextPlayer: null,
        emptyCell: "",
        connectionToWin: 4,
        winningMessage: " Player is winner. Please reload to play again.",
        possibleDiagonalWinCombinations: [
            ['00', '11', '22', '33'],
            ['11', '22', '33', '44'],
            ['22', '33', '44', '55'],
            ['10', '21', '32', '43'],
            ['21', '32', '43', '54'],
            ['20', '31', '42', '53'],
            ['01', '12', '23', '34'],
            ['12', '23', '34', '45'],
            ['23', '34', '45', '56'],
            ['02', '13', '24', '35'],
            ['13', '24', '35', '46'],
            ['03', '14', '25', '36'],
            ['30', '21', '12', '03'],
            ['40', '31', '22', '13'],
            ['31', '22', '13', '04'],
            ['50', '41', '32', '23'],
            ['41', '32', '23', '14'],
            ['32', '23', '14', '05'],
            ['51', '42', '33', '24'],
            ['42', '33', '24', '15'],
            ['33', '24', '15', '06'],
            ['52', '43', '34', '25'],
            ['43', '34', '25', '16'],
            ['53', '44', '35', '26']
        ]
    };

    var interval = null;

    // Main game function. Returns object exposing public API.
    var game = function () {
        var board = document.getElementById("board");

        // Plays the game
        var play = function (player) {
            var column = Math.floor(Math.random() * 6);
            var row = move(player, column);

            if (!row) return;
            var isWinner = checkForWin(player, column, row);

            if (isWinner) {
                clearInterval(interval);
                announceWinner(player);
            }

            config.nextPlayer = player === config.redPlayer ? config.blackPlayer : config.redPlayer;
        };

        // Announces the winner
        var announceWinner = function (player) {
            setTimeout(function () {
                alert(player.toUpperCase() + config.winningMessage);
                throw new Error("Just to stop execution");
            }, 500);
        };

        // Plays the player move to particular cell
        var move = function (player, column) {
            var movedToRow = null;

            for (var i = 5; i >= 0; i--) {
                var possibleColumnCell = document.getElementById("td" + i + column);

                if (possibleColumnCell.style.backgroundColor === config.emptyCell) {
                    possibleColumnCell.style.backgroundColor = player;
                    movedToRow = i;
                    break;
                }
            }

            return movedToRow;
        };

        // Check if the win is from horizontal combinations
        var isHorizontalWin = function (player, column, row) {
            var connections = 0;
            var previousCellPlayer = player;

            for (var j = 0; j < 7; j++) {
                var columnCell = document.getElementById("td" + row + j);
                var currentCellPlayer = columnCell.style.backgroundColor;

                if (currentCellPlayer === player && (previousCellPlayer === player || connections === 0)) {
                    connections++;
                } else {
                    connections = 0;
                }

                if (connections === config.connectionToWin) return true;

                previousCellPlayer = currentCellPlayer;
            }

            return false;
        };

        // Check if win is from vertical combinations
        var isVerticalWin = function (player, column) {
            var connections = 0;
            var previousCellPlayer = player;

            for (var i = 0; i < 6; i++) {
                var columnCell = document.getElementById("td" + i + column);
                var currentCellPlayer = columnCell.style.backgroundColor;

                if (currentCellPlayer === player && (previousCellPlayer === player || connections === 0)) {
                    connections++;
                } else {
                    connections = 0;
                }

                if (connections === config.connectionToWin) return true;

                previousCellPlayer = currentCellPlayer;
            }

            return false;
        };

        // Check if win is from diagonal combinations
        var isDiagonalWin = function (player) {
            for (var i = 0; i < config.possibleDiagonalWinCombinations.length; i++) {
                var firstDiagonalCell = document.getElementById("td" + config.possibleDiagonalWinCombinations[i][0]);
                var secondDiagonalCell = document.getElementById("td" + config.possibleDiagonalWinCombinations[i][1]);
                var thirdDiagonalCell = document.getElementById("td" + config.possibleDiagonalWinCombinations[i][2]);
                var fourthDiagonalCell = document.getElementById("td" + config.possibleDiagonalWinCombinations[i][3]);

                if (firstDiagonalCell.style.backgroundColor === player &&
                    secondDiagonalCell.style.backgroundColor === player &&
                    thirdDiagonalCell.style.backgroundColor === player &&
                    fourthDiagonalCell.style.backgroundColor === player) {
                    return true;
                }
            }

            return false;
        };

        // Check all the possibility of a win for a player
        var checkForWin = function (player, column, row) {
            return isHorizontalWin(player, column, row) || isVerticalWin(player, column) || isDiagonalWin(player);
        };

        return {
            // Init the game and create the board
            init: function () {
                for (var i = 0; i < 6; i++) {
                    board.innerHTML += "<tr id='tr" + i + "'></tr>";
                    var row = document.getElementById("tr" + i);

                    for (var j = 0; j < 7; j++) {
                        row.innerHTML += "<td id='td" + i + j + "'></td>";
                    }
                }
            },
            // Plays the game interchanging the player
            play: function (player) {
                play(player);
                interval = setInterval(function () {
                    play(config.nextPlayer);
                }, 1000);
            }
        }
    };

    game().init();
    game().play(config.redPlayer);
}());
