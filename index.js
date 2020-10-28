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
    background.src = 'Images/jungle.gif';
    let catchSounds = [];
    let catchSoundCounter = 0;
    for (let i = 0; i < 5; i++) {
        let catchSound = new Audio();
        catchSound.src = 'Audio/bleep.wav';
        catchSounds.push(catchSound);
    }

    let music = new Audio();
    music.src = 'Audio/Mountains.mp3';
    music.loop = true;

    let smashSounds = [];
    let smashCounter = 0;
    for (let i = 0; i < 5; i++) {
        let smash = new Audio();
        smash.src = 'Audio/smash.mp3';
        smashSounds.push(smash);
    }

    let player;
    let foods = [];
    let numberOfFoods = 15;

    //Player constructor
    function Player() {
        this.gameOver = false;
        this.score = 0;
        this.foodsCollected = 0;
        this.foodsMissed = 0;
        this.playerWidth = 230;
        this.playerHeight = 230;
        this.playerSpeed = 50;
        this.x = 400;
        this.y = 415;
        this.playerImage = new Image();
        this.playerImage.src = 'Images/cat.png';

        //Draws the player
        this.render = function () {
            context.drawImage(this.playerImage, this.x, this.y);
        }

        //Moves the player left
        this.moveLeft = function () {
            if (this.x > 0) {
                this.x -= this.playerSpeed;
            }
        }

        //Moves the player right
        this.moveRight = function () {
            if (this.x < canvas.width - this.playerWidth) {
                this.x += this.playerSpeed;
            }
        }
    }

    //Food constructor
    function Food() {
        this.foodNumber = Math.floor(Math.random() * 5);
        this.foodType = "";
        this.foodScore = 0;
        this.foodWidth = 50;
        this.foodHeight = 50;
        this.foodImage = new Image();
        this.foodSpeed = Math.floor(Math.random() * 3 + 1);
        this.x = Math.random() * (canvas.width - this.foodWidth);
        this.y = Math.random() * -canvas.height - this.foodHeight;

        //Creates a different kind of food depending on the food number
        //which is generated randomly
        this.chooseFood = function () {
            if (this.foodNumber == 0) {
                this.foodType = "banana";
                this.foodScore = 5 * this.foodSpeed;
                this.foodImage.src = 'Images/shrimp.png';
            } else if (this.foodNumber == 1) {
                this.foodType = "apple";
                this.foodScore = 10 * this.foodSpeed;
                this.foodImage.src = 'Images/fish.png';
            } else if (this.foodNumber == 2) {
                this.foodType = "orange";
                this.foodScore = 15 * this.foodSpeed;
                this.foodImage.src = 'Images/bird.png';
            } else if (this.foodNumber == 4) {
                this.foodType = "melon";
                this.foodScore = 25 * this.foodSpeed;
                this.foodImage.src = 'Images/melon2.png';
            }
        }

        //Makes the food descend.
        //While falling checks if the food has been caught by the player
        //Or if it hit the floor.
        this.fall = function () {
            if (this.y < canvas.height - this.foodHeight) {
                this.y += this.foodSpeed;
            } else {
                smashSounds[smashCounter].play();
                if (smashCounter == 4) {
                    smashCounter = 0;
                } else {
                    smashCounter++;
                }

                player.foodsMissed += 1;
                this.changeState();
                this.chooseFood();
            }
            this.checkIfCaught();
        }

        //Checks if the food has been caught by the player
        //If it is caught, the player score and food counter is increased, and
        //the current food changes its state and becomes a different food.
        this.checkIfCaught = function () {
            if (this.y >= player.y) {
                if ((this.x > player.x && this.x < (player.x + player.playerWidth)) ||
                    (this.x + this.foodWidth > player.x && this.x + this.foodWidth < (player.x + player.playerWidth))) {
                    catchSounds[catchSoundCounter].play();
                    if (catchSoundCounter == 4) {
                        catchSoundCounter = 0;
                    } else {
                        catchSoundCounter++;
                    }

                    player.score += this.foodScore;
                    player.foodsCollected += 1;

                    this.changeState();
                    this.chooseFood();
                }
            }
        }

        //Randomly updates the food speed, food number, which defines the type of food
        //And also changes its x and y position on the canvas.
        this.changeState = function () {
            this.foodNumber = Math.floor(Math.random() * 5);
            this.foodSpeed = Math.floor(Math.random() * 3 + 1);
            this.x = Math.random() * (canvas.width - this.foodWidth);
            this.y = Math.random() * -canvas.height - this.foodHeight;
        }

        //Draws the food.
        this.render = function () {
            context.drawImage(this.foodImage, this.x, this.y);
        }
    }

    //Adds controls. Left arrow to move left, right arrow to move right.
    //ENTER to restart only works at the game over screen.
    window.addEventListener("keydown", function (e) {
        e.preventDefault();
        if (e.keyCode == 37) {
            player.moveLeft();
        } else if (e.keyCode == 39) {
            player.moveRight();
        } else if (e.keyCode == 13 && player.gameOver == true) {
            main();
            window.clearTimeout(timer);
        }
    });

    main();

    //Fills an array of foods, creates a player and starts the game
    function main() {
        contextBack.font = "bold 23px Velvetica";
        contextBack.fillStyle = "WHITE";
        player = new Player();
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
        if (player.foodsMissed >= 10) {
            player.gameOver = true;
        }

        for (let j = 0; j < foods.length; j++) {
            foods[j].fall();
        }
        timer = window.setTimeout(updateGame, 30);
    }

    //Draws the player and foods on the screen as well as info in the HUD.
    function drawGame() {
        if (player.gameOver == false) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            contextBack.clearRect(0, 0, canvasBack.width, canvasBack.height);

            contextBack.drawImage(background, 0, 0);
            player.render();

            for (let j = 0; j < foods.length; j++) {
                foods[j].render();
            }
            contextBack.fillText("SCORE: " + player.score, 50, 50);
            contextBack.fillText("HI SCORE: " + hiscore, 250, 50);
            contextBack.fillText("FOOD CAUGHT: " + player.foodsCollected, 500, 50);
            contextBack.fillText("FOOD MISSED: " + player.foodsMissed, 780, 50);
        } else {
            //Different screen for game over.
            for (let i = 0; i < numberOfFoods; i++) {
                console.log("Speed was" + foods[foods.length - 1].foodSpeed);
                foods.pop();
            }

            if (hiscore < player.score) {
                hiscore = player.score;
                contextBack.fillText("NEW HI SCORE: " + hiscore, (canvas.width / 2) - 100, canvas.height / 2);
            }
            contextBack.fillText("PRESS ENTER TO RESTART", (canvas.width / 2) - 140, canvas.height / 2 + 50);
            context.clearRect(0, 0, canvas.width, canvas.height);

        }
        window.requestAnimationFrame(drawGame);

    }
}