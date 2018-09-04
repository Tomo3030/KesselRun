if(localStorage.getItem("highscoreStored") === null){
    let highScoreList1 = [
    {name: "Tim", score: 13000},
    {name: "Slim", score: 9000 },
    {name: "Trim", score: 8000},
    {name: "Dim", score: 7000},
    {name: "Bim.bo", score: 6000}
    ];

    localStorage.setItem("highscoreStored", JSON.stringify(highScoreList1));
}

const myGameArea = {
    canvas : document.getElementById('canvas'),
    canvas1 : document.getElementById('canvas1'),
    start : function(){
        //this.canvas.width = 540;
        //this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        this.context1 = this.canvas1.getContext('2d')
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        //set Event listeners for controllers:
        window.addEventListener('keydown',function(e){
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e){
            myGameArea.keys[e.keyCode] = false;
        })
        this.obstacles = [];
        this.astroidType = ["images/astroid1.png","images/astroid2.png","images/astroid3.png","images/astroid4.png","images/astroid5.png","images/astroid6.png" ];
        this.obstacleOrginSide;
        this.gameOn = true;
        this.backgroundColor = 255;
        this.score;
        this.highScoreList = JSON.parse(localStorage.getItem("highscoreStored"));
    },

    clear : function(){
        this.context.clearRect(0,0, this.canvas.width,this.canvas.height);
    },

    stop : function(){
        clearInterval(this.interval);
    },

    displayObstacles : function(){
        if (this.frameNo == 1 || everyInterval(70)){
            end = this.canvas.height - this.canvas.height * .20;
            start = this.canvas.height - this.canvas.height * .90;
            x = this.canvas.width;
            y = Math.floor((Math.random() * end) + start);
            let astroid = this.astroidType[Math.floor(Math.random() * this.astroidType.length)];

            if(this.obstacleOrginSide){
                this.obstacles.push(new component(25,25,astroid,x,y,"image"));
                this.obstacleOrginSide = !this.obstacleOrginSide;
            } else {
                this.obstacles.push(new component(25,25,astroid, -10,y,"image","left"));
                this.obstacleOrginSide = !this.obstacleOrginSide; 
            }
        }
    },

    moveAndDestroyObstacles : function(){
        for (let i = 0; i < this.obstacles.length; i++) {
            if(this.obstacles[i].side == "left"){
                this.obstacles[i].x += 1; 
                this.obstacles[i].angle += .03;   
            } else{
                this.obstacles[i].x += -1;
                this.obstacles[i].angle += -.03;
            }

            this.obstacles[i].update();
            // delete obstacles that go offscreeen so our array doesn't get crazy long
            if(this.obstacles[i].offscreen()){
                this.obstacles.splice(i,1);
            } 
        }
    },

    displayInstructions : function(){
        if(this.gameOn && myGamePiece.speed < 3){
            startText = new component("31px", "Orbitron", "fff", 8, this.canvas.height/3,"text");
            startText.text = "Press Up Arrow To Accelerate";
            startText.update();
        }
    },

    checkCrash : function(){
        for(let i = 0; i < this.obstacles.length; i++) {
            if((this.gameOn) && myGamePiece.crashWith(this.obstacles[i])){
                myGamePiece.width = 0;
                myGamePiece.height = 0;
                myGamePiece.speed = 0;
                this.gameOn = !this.gameOn;
                this.makeParticles(myGamePiece.x,myGamePiece.y);   
            }
            this.explosion();

        }
    },

    makeParticles : function(x,y){
        const numberOfParticles = 35;
        let particleAngle = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            myGamePiece.particles.push(new component(5,5,"#fff",x,y,"explosion"));
        }
        for (let i = 0; i < myGamePiece.particles.length; i++) {
            particleAngle += 1;
            myGamePiece.particles[i].speed = Math.floor((Math.random()* 2.5) + 1.5);
            myGamePiece.particles[i].angle = particleAngle;
        } 
    },

    explosion : function(){
        for (let j = 0; j < myGamePiece.particles.length; j++) {
            alpha = ((j-5) * 5)/(-100);
            myGamePiece.particles[j].newPos();
            myGamePiece.particles[j].update(alpha);
            if(myGamePiece.particles[j].offscreen()){
                myGamePiece.particles.splice(j,1);
            }
            if(myGamePiece.particles.length == 0){
                this.show();
            }
        }
    },

    checkWin : function(){
        if(myGamePiece.y < - myGamePiece.height){return true;}
    },

    getGameStats : function(){

        // this just checks where along the x axis the game piece crosses the line. The player wants to cross line in the middle. This if statement below just makes sure the multplyer is >270 (canvas/2). becuase later calculateMuliplyer funtion turns the variable muliplyer into value of maximum two.
        let multiplyer; 
        if(myGamePiece.x > (this.canvas.width/2)){
            multiplyer = (myGamePiece.x - this.canvas.width) * -1;
        } else {
            multiplyer = myGamePiece.x;
        }
        this.stop();
        this.clear();
        finishBorder.update();
        let speed = (myGamePiece.speed * 1000).toFixed(0);
        let multiDisplay = this.calculateMultiplyer(multiplyer);
        yourScore = (multiDisplay * speed).toFixed(0);
        $("#speed").text(speed);
        $("#multiplyer").text(multiDisplay);
        $("#score").text(yourScore);
        myGamePiece.speed = 0;
        this.gameOn = !this.gameOn;
        myGamePiece.score = yourScore;
    },

    checkHighScore : function(yourScore){
        //just for the record, what is happening here when we read the scores out from memeory the score is a string,
        // so we need to parseInt to make it an int and campairable.
        // For the record (parseInt take in a number, and the base system the number should be reprseneted as)
        yourScore = parseInt(yourScore, 10);
        function sub(){
            for (let i = 0; i < myGameArea.highScoreList.length; i++) {
                if(yourScore > parseInt(myGameArea.highScoreList[i].score,10)){
                    myGamePiece.scorePosition = i;
                    return true;
                }
            }
        } 
        return sub(); 

    },

    calculateMultiplyer : function(multiplyer){
        return((multiplyer * 2)/(this.canvas.width/2)).toFixed(2);
    },

    changeFinishColor : function(){
        if(this.frameNo%7==0){
            this.backgroundColor += -1;
            finishBorder.color = "rgb(" + this.backgroundColor + "," + this.backgroundColor + ",255)";
            if(myGamePiece.speed >= 5 && this.frameNo%15==0){
                if(this.backgroundColor <= 0 && this.backgroundColor%2==0){
                    finishBorder.color = "white";
                }if(this.backgroundColor <= 0 && this.backgroundColor%2==1){
                    finishBorder.color = "rgb(255,0,0)";
                }
            }
        }
    },

    makeStars : function(){
        const numberOfStars = 50;
        for (let i = 0; i < numberOfStars; i++) {
            let starShape = Math.floor((Math.random() * 5) + 1);
            starArray.push(new component(starShape,starShape,"white", Math.floor((Math.random() * this.canvas.width) + 1),Math.floor((Math.random() * this.canvas.height * .90) + 1),"stars")); 
        }
    },

    makeScore : function(highScoreName,i){

        //console.log(JSON.parse(localStorage.getItem("highscoreStored")));
        let highScoreList = JSON.parse(localStorage.getItem("highscoreStored"));


        let newScore = {name: highScoreName, score: yourScore};


        highScoreList.splice(i,0,newScore);
        highScoreList.pop();
        localStorage.setItem("highscoreStored", JSON.stringify(highScoreList));
        this.highScoreList = highScoreList;
        this.show();
    },

    show : function(){
        $(".scoreboard").removeClass("hidden");

        $('.highscore').each(function(index){
            $(this).text(myGameArea.highScoreList[index].score);
        });

        $('.name').each(function(index){
            $(this).text(myGameArea.highScoreList[index].name);
        });

        $('.reload').click(function(){
            location.reload();
        });

    },

    giveName : function(i){
      $('.nameInput').removeClass('hidden');
      $('.submit').click(function(){
        highScoreName = $('.text').val();
        $('.nameInput').addClass('hidden');
        myGameArea.makeScore(highScoreName, i);
    });

  }
}



function component(width, height, color, x, y, type, side){
    this.type = type;
    if(this.type == "image"){
        this.image = new Image();
        this.image.src = color;
        this.cropPosX = 0;
        this.cropPosY = 0;
    }
    this.color = color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
    this.angle = 0;
    this.moveAngle = 0;
    this.speed = 0;
    this.particles = [];
    this.side = side;
    //this.scorePosition = 5;


    this.update = function(alpha){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        if(this.type == 'text'){
            ctx.font = this.width + " " + this.height;
            ctx.fillText(this.text, this.x, this.y);
        } else if(this.type == 'turn'){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        } else if(this.type == 'explosion'){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = alpha;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        } else if(this.type == 'image'){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image,this.cropPosX,this.cropPosY,this.width,this.height, this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        } else if(this.type == 'gradient'){
            let grd = ctx.createRadialGradient(this.width/2,0,10,this.width/2,0,250);
            grd.addColorStop(0, "darkgray");
            grd.addColorStop(.5, this.color);
            grd.addColorStop(1,"black");
            ctx.save();
            ctx.scale(1,.3);
            ctx.fillStyle = grd;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        } 
        else if (this.type == "stars") {
            ctx = myGameArea.context1;
            ctx.fillStyle = color;
            ctx.save();
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 15;
            ctx.translate(this.x,this.y);
            ctx.rotate(45 * Math.PI/180);
            ctx.fillRect(this.width/-2, this.height/-2, this.width, this.height);
            ctx.restore();
        }
    }

    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }

}

component.prototype.scorePosition = 5;

component.prototype.offscreen = function(){
    if(this.x < -this.width || this.x > myGameArea.canvas.width || this.y < 0 || this.y > myGameArea.canvas.height){
        return true;
    } else {
        return false;
    }
}

component.prototype.noOutOfBounds = function(){
    if(this.x < (myGameArea.canvas.width - (myGameArea.canvas.width))){
        this.x = (myGameArea.canvas.width - (myGameArea.canvas.width));
        this.speed -= .002;
    }
    if(this.x > (myGameArea.canvas.width + myGamePiece.width/2)){
        this.x = (myGameArea.canvas.width + myGamePiece.width/2         );
        this.speed -= .002;
    }
    if(this.y > (myGameArea.canvas.height- myGamePiece.height)){
        this.y = (myGameArea.canvas.height- myGamePiece.height);
        this.speed -= .002;
    }
}

component.prototype.moveSpaceShip = function(){
    if(myGameArea.gameOn){
        myGamePiece.speed += .001;
        this.animateSpaceship("straight");
        // game controls
        if (myGameArea.keys && myGameArea.keys[37]) {
            myGamePiece.moveAngle = -myGamePiece.speed;
            this.animateSpaceship("right"); 
        }
        if (myGameArea.keys && myGameArea.keys[39]) {
            myGamePiece.moveAngle = myGamePiece.speed;
            this.animateSpaceship("left"); 
        }
        if (myGameArea.keys && myGameArea.keys[38] && (myGamePiece.speed < 4)) {
            myGamePiece.speed += .03;
            this.animateSpaceship("fullblast")
        }
        if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed += -.01; }

        //remove this after finish scoreboard
        if (myGameArea.keys && myGameArea.keys[32] && (myGamePiece.speed < 10)) {
            myGamePiece.speed += .03;
            this.animateSpaceship("fullblast") 
        }
        if (myGameArea.keys && myGameArea.keys[40]) {
            myGamePiece.speed += -.01; 
        }
    }
}

component.prototype.animateSpaceship = function(direction){
   if(myGameArea.frameNo%5==0){

    if(direction == "straight"){
        myGamePiece.cropPosY = 0;
        myGamePiece.cropPosX += myGamePiece.width;
        if(myGamePiece.cropPosX > myGamePiece.width*2){
            myGamePiece.cropPosX = 0;
        }
    }
    if(direction == "left"){
        myGamePiece.cropPosY = myGamePiece.height;
        myGamePiece.cropPosX += myGamePiece.width;
        if(myGamePiece.cropPosX > myGamePiece.width*2){
            myGamePiece.cropPosX = 0;
        }
    }
    if(direction == "right"){
        myGamePiece.cropPosY = (myGamePiece.height*2);
        myGamePiece.cropPosX += myGamePiece.width;
        if(myGamePiece.cropPosX > myGamePiece.width*2){
            myGamePiece.cropPosX = 0;
        }
    }
    if(direction == "fullblast"){
        myGamePiece.cropPosY = (myGamePiece.height*3);
        myGamePiece.cropPosX += myGamePiece.width;
        if(myGamePiece.cropPosX > myGamePiece.width*2){
            myGamePiece.cropPosX = 0;
        }
    }
}
}

component.prototype.crashWith = function(obstacle){

    let distanceBetweenX = Math.abs(obstacle.x + (obstacle.width/2) - this.x - this.width/2) + 3;
    let distanceBetweenY = Math.abs(obstacle.y + (obstacle.height/2) - this.y - this.height/2) + 3;


    if(distanceBetweenX > (this.width/2 + (obstacle.width/2 + 2))){return false;}
    if(distanceBetweenY > (this.height/2 + (obstacle.width/2 + 2))){return false;}
    if(distanceBetweenX <= this.width/2 && distanceBetweenY <= this.height/2){return true;}

    let dx = distanceBetweenX - (this.width/2 - 5);
    let dy = distanceBetweenY - (this.height/2 - 5);
    if(dx * dx + dy * dy <= ((obstacle.width/2) * (obstacle.width/2))){return true;}
}




