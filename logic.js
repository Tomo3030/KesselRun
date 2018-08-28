let starArray = []; 


function startGame() {
    myGameArea.start();
    myGamePiece = new component(28,36,"images/spaceship.png",(myGameArea.canvas.width/2), myGameArea.canvas.height * .95, "image");
    finishBorder = new component(myGameArea.canvas.width, 300, "rgb(255,255,255)" ,0,0,"gradient");
    //the finish line is what the gamePiece must actually crashWith() in order to win.
    finishline = new component(myGameArea.canvas.width,28,"transparent",0,0);
    score = new component("30px","Orbitron","white",15,myGameArea.canvas.height -30,"text");
    myGameArea.makeStars();
    for (var i = 0; i < starArray.length; i++) {
        starArray[i].update();
    }
}

//myGameArea.start uses this function to decide the update interval.
function everyInterval(n){
    if((myGameArea.frameNo / n) % 1 == 0){return true;}
    return false;
}
//myGameArea.start calls this function every interval, as seen above.
function updateGameArea(){
    myGameArea.clear();

    
    finishBorder.update();
    finishline.update();
    myGamePiece.newPos();
    myGamePiece.update();
    myGamePiece.moveAngle = 0;
    myGameArea.frameNo += 1;
    score.text = "SPEED: " + (Math.round(myGamePiece.speed * 1000,0));
    score.update();
    myGameArea.displayInstructions();
    //makes obstacles and orients them 
    myGameArea.displayObstacles();
    //moves obscatacles across screen and destroys obstacles offscreen
    myGameArea.moveAndDestroyObstacles();
    //check if gamepiece crashed with obstacles, and if it has create explosion.
    myGameArea.checkCrash();
    //check if gamepiece has passed the finished line, and if it has create score.
    if(myGameArea.checkWin()){
        myGameArea.getGameStats();
        if(myGameArea.checkHighScore(myGamePiece.score)){
            myGameArea.giveName(myGamePiece.scorePosition);
        } else{
            myGameArea.show();
        }
    };

//check for key stroke. To control the game. 
myGamePiece.moveSpaceShip();
//make sure gamepiece doesn't go outside of canvas
myGamePiece.noOutOfBounds();
//makes the finish boarder gradually get more blue and start flashing at around speed 5000 
myGameArea.changeFinishColor();

};



