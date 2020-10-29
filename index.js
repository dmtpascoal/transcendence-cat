window.onload = function () {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const canvasBack = document.getElementById("backgroundCanvas");
    const contextBack = canvasBack.getContext("2d");

    //Timer for the Timeout - needed in order to clear it
    let timer;

    //Keeps track of hi score
    let hiscore = 0;

    //Background image, music track, and arrays of sounds.
    let background = new Image();
    background.src = 'Images/space.jpg';
 

    let music = new Audio();
    music.src = 'Audio/Mountains.mp3';
    music.loop = true;

    //Adds controls. Left arrow to move left, right arrow to move right.
    //ENTER to restart only works at the game over screen.
    window.addEventListener("keydown", function (e) {
        e.preventDefault();
        if (e.keyCode == 37) {
            cat.moveLeft();
        } else if (e.keyCode == 39) {
            cat.moveRight();
        } else if (e.keyCode == 13 && cat.gameOver == true) {
            main();
            window.clearTimeout(timer);
        }
    });

    main();

    //Fills an array of foods, creates a cat and starts the game
    function main() {
        contextBack.font = "bold 23px Velvetica";
        contextBack.fillStyle = "WHITE";
        cat = new Cat();
        foods = [];

        for (let i = 0; i < numberOfFoods; i++) {
            let food = new Food();
            food.chooseFood();
            foods.push(food);
        }

        startGame();
    }

    function startGame() {
        updateGame();
        window.requestAnimationFrame(drawGame);
    }

    //Checks for gameOver and makes each food in the array fall down.
    function updateGame() {
        music.play();
        if (cat.foodsMissed >= 10) {
            cat.gameOver = true;
        }

        for (let j = 0; j < foods.length; j++) {
            foods[j].fall(foods[j]);
        }
        timer = window.setTimeout(updateGame, 30);
    }

    //Draws the cat and foods on the screen as well as info in the HUD.
    function drawGame() {
        if (cat.gameOver == false) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);

            contextBack.drawImage(background, 0, 0);
            cat.render();

            for (let j = 0; j < foods.length; j++) {
                foods[j].render();
            }
            contextBack.fillText("SCORE: " + cat.score, 50, 50);
            contextBack.fillText("HI SCORE: " + hiscore, 250, 50);
            contextBack.fillText("FOOD CAUGHT: " + cat.foodsCollected, 500, 50);
            contextBack.fillText("FOOD MISSED: " + cat.foodsMissed, 780, 50);
        } else {
            //Different screen for game over.
            for (let i = 0; i < numberOfFoods; i++) {
                console.log("Speed was" + foods[foods.length - 1].foodSpeed);
                foods.pop();
            }

            if (hiscore < cat.score) {
                hiscore = cat.score;
                contextBack.fillText("NEW HI SCORE: " + hiscore, (canvas.width / 2) - 100, canvas.height / 2);
            }
            contextBack.fillText("PRESS ENTER TO RESTART", (canvas.width / 2) - 140, canvas.height / 2 + 50);
            context.clearRect(0, 0, canvas.width, canvas.height);

        }
        window.requestAnimationFrame(drawGame);

    }
};