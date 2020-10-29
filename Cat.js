const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

class Cat {
    constructor() {
        this.gameOver = false;
        this.score = 0;
        this.foodsCollected = 0;
        this.foodsMissed = 0;
        this.catWidth = 180;
        this.catHeight = 230;
        this.catSpeed = 50;
        this.x = 400;
        this.y = 470;
        this.catImage = new Image();
        this.catImage.src = 'Images/cat.png';
    }
    //Draws the cat
    render () {
        context.drawImage(this.catImage, this.x, this.y);
    }

    //Moves the cat left
    moveLeft() {
        if (this.x > 0) {
            this.x -= this.catSpeed;
        }
    }

    //Moves the cat right
    moveRight() {
        if (this.x < canvas.width - this.catWidth) {
            this.x += this.catSpeed;
        }
    }
}