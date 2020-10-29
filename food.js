let cat;
    let foods = [];
    let numberOfFoods = 15;

    let catchSounds = [];
    let catchSoundCounter = 0;
    for (let i = 0; i < 5; i++) {
        let catchSound = new Audio();
        catchSound.src = 'Audio/bleep.wav';
        catchSounds.push(catchSound);
    }

    let smashSounds = [];
    let smashCounter = 0;
    for (let i = 0; i < 5; i++) {
        let smash = new Audio();
        smash.src = 'Audio/smash.mp3';
        smashSounds.push(smash);
    }

class Food {
    constructor(){
        this.foodNumber = Math.floor(Math.random() * 5);
        this.foodType = "";
        this.foodScore = 0;
        this.foodWidth = 100;
        this.foodHeight = 50;
        this.foodImage = new Image();
        this.foodSpeed = Math.floor(Math.random() * 3 + 1);
        this.x = Math.random() * (canvas.width - this.foodWidth);
        this.y = 0;
    }
    chooseFood() {
        if (this.foodNumber == 0) {
            this.foodType = "shrimp";
            this.foodScore = 10 * this.foodSpeed;
            this.foodImage.src = 'Images/shrimp.png';
        } else if (this.foodNumber == 1) {
            this.foodType = "fish";
            this.foodScore = 15 * this.foodSpeed;
            this.foodImage.src = 'Images/fish.png';
        } else if (this.foodNumber == 2) {
            this.foodType = "birds";
            this.foodScore = 20 * this.foodSpeed;
            this.foodImage.src = 'Images/bird.png';
        } else if (this.foodNumber == 4) {
            this.foodType = "evil-flower";
            this.foodScore = 5 * this.foodSpeed;
            this.foodImage.src = 'Images/flower.png';
        }
        return this.foodType;
    }

    //Makes the food descend.
    //While falling checks if the food has been caught by the cat
    //Or if it hit the floor.
    fall(food) {
        if (this.y < canvas.height - this.foodHeight) {
            this.y += this.foodSpeed;
        }
        else {
            smashSounds[smashCounter].play();
            if (smashCounter == 4) {
                smashCounter = 0;
            } else {
                smashCounter++;
            }
            if (this.foodType != 'evil-flower') {
            cat.foodsMissed += 1;}
            this.changeState();
        }
        this.checkIfCaught(food);
    }
    //Checks if the food has been caught by the cat
    //If it is caught, the cat score and food counter is increased, and
    //the current food changes its state and becomes a different food.
    checkIfCaught (food) {
        if (this.y >= cat.y) {
            if ((this.x > cat.x && this.x < (cat.x + cat.catWidth)) ||
                (this.x + this.foodWidth > cat.x && this.x + this.foodWidth < (cat.x + cat.catWidth))) {
                
                catchSounds[catchSoundCounter].play();
                if (catchSoundCounter == 4) {
                    catchSoundCounter = 0;
                } else {
                    catchSoundCounter++;
                }

                cat.score += this.foodScore;
                if (food.foodType != 'evil-flower') {
                    cat.foodsCollected += 1;
                }
                else {
                    cat.flowerCaught = true;
                }
                this.changeState();
            }
        }
    }

    //Randomly updates the food speed, food number, which defines the type of food
    //And also changes its x and y position on the canvas.
    changeState() {
        this.foodNumber = Math.floor(Math.random() * 5);
        this.foodSpeed = Math.floor(Math.random() * 3 + 1);
        this.x = Math.random() * (canvas.width - this.foodWidth);
        this.y = Math.random() * -canvas.height - this.foodHeight;
    }

    //Draws the food.
    render() {
        context.drawImage(this.foodImage, this.x, this.y);
    }
}