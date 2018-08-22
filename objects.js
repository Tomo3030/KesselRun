const myGameArea = {
    canvas : document.createElement('canvas'),
    start : function(){
        this.canvas.width = 540;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
    },

    clear : function(){
        this.context.clearRect(0,0, this.canvas.width,this.canvas.height);
    },

    stop : function(){
        clearInterval(this.interval);
    },

    displayObstacles : function(){
        if (myGameArea.frameNo == 1 || everyInterval(70)){
            end = myGameArea.canvas.height - myGameArea.canvas.height * .20;
            start = myGameArea.canvas.height - myGameArea.canvas.height * .90;
            x = myGameArea.canvas.width;
            y = Math.floor((Math.random() * end) + start);
            let astroid = myGameArea.astroidType[Math.floor(Math.random()*myGameArea.astroidType.length)];

            if(this.obstacleOrginSide){
                //myGameArea.obstacles.push(new component(25,25, "white", x, y, 'turn'));
                myGameArea.obstacles.push(new component(25,25,astroid,x,y,"image"));
                this.obstacleOrginSide = !this.obstacleOrginSide;
            } else {
                //myGameArea.obstacles.push(new component(25,25, "white", -10, y, 'turn', "left"));
                myGameArea.obstacles.push(new component(25,25,astroid, -10,y,"image","left"));
                this.obstacleOrginSide = !this.obstacleOrginSide; 
            }
        }
    },

    moveAndDestroyObstacles : function(){
        for (let i = 0; i < myGameArea.obstacles.length; i++) {
            if(myGameArea.obstacles[i].side == "left"){
                myGameArea.obstacles[i].x += 1; 
                myGameArea.obstacles[i].angle += .03;   
            } else{
                myGameArea.obstacles[i].x += -1;
                myGameArea.obstacles[i].angle += -.03;
            }

            myGameArea.obstacles[i].update();
            // delete obstacles that go offscreeen so our array doesn't get crazy long
            if(myGameArea.obstacles[i].offscreen()){
                myGameArea.obstacles.splice(i,1);
            } 
        }
    },

    displayInstructions : function(){
        if(this.gameOn && myGamePiece.speed < 3){
            startText = new component("31px", "Orbitron", "fff", 8, myGameArea.canvas.height/3,"text");
            startText.text = "Press Up Arrow To Accelerate";
            startText.update();
        }
    },

    checkCrash : function(){
        for(let i = 0; i < myGameArea.obstacles.length; i++) {
            if((this.gameOn) && myGamePiece.crashWith(myGameArea.obstacles[i])){
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
        for (var i = 0; i < numberOfParticles; i++) {
            myGamePiece.particles.push(new component(5,5,"#fff",x,y,"explosion"));
        }
        for (var i = 0; i < myGamePiece.particles.length; i++) {
            particleAngle += 1;
            myGamePiece.particles[i].speed = Math.floor((Math.random()* 2) + 1);
            myGamePiece.particles[i].angle = particleAngle;
        } 
    },

    explosion : function(){
        for (var j = 0; j < myGamePiece.particles.length; j++) {
            alpha = ((j-5) * 5)/(-100);
            myGamePiece.particles[j].newPos();
            myGamePiece.particles[j].update(alpha);
            if(myGamePiece.particles[j].offscreen()){
                myGamePiece.particles.splice(j,1);
            }
        }
    },

    checkWin : function(){
        if(myGamePiece.y < 0 - myGamePiece.height){
            // this just checks where along the x axis the game piece crosses the line. The player wants to cross line in the middle. This if statement below just makes sure the multplyer is >270 (canvas/2). becuase later calculateMuliplyer funtion turns the variable muliplyer into value of maximum two.
            let multiplyer; 
            if(myGamePiece.x > (myGameArea.canvas.width/2)){
                multiplyer = (myGamePiece.x - myGameArea.canvas.width) * -1;
            } else {
                multiplyer = myGamePiece.x;
            }
            myGameArea.stop();
            displaySpeed = new component("38px", "Orbitron", "fff", 8, 120,"text");
            displaySpeed.text = "SPEED: " + (myGamePiece.speed * 1000).toFixed(0);
            displaySpeed.update();
            displayMultiplyer = new component("38px", "Orbitron", "fff", 8, 170 ,"text");
            displayMultiplyer.text = "MULTIPLYER: " + this.calculateMultiplyer(multiplyer);
            displayMultiplyer.update();
            displayTotal = new component("38px", "Orbitron", "fff", 8, 220 ,"text");
            displayTotal.text = "TOTAL SCORE: " + (this.calculateMultiplyer(multiplyer) * myGamePiece.speed*1000).toFixed(0);
            displayTotal.update();
            myGamePiece.speed = 0;
            myGameArea.gameOn = !myGameArea.gameOn;
        }

    },

    calculateMultiplyer : function(multiplyer){
        return((multiplyer * 2)/(myGameArea.canvas.width/2)).toFixed(2);
    },

    changeFinishColor : function(){
        if(myGameArea.frameNo%7==0){
            this.backgroundColor += -1;
            finishBorder.color = "rgb(" + this.backgroundColor + "," + this.backgroundColor + ",255)";
            if(myGamePiece.speed >= 5 && myGameArea.frameNo%15==0){
                if(this.backgroundColor <= 0 && backgroundColor%2==0){
                    finishBorder.color = "white";
                }if(this.backgroundColor <= 0 && backgroundColor%2==1){
                    finishBorder.color = "rgb(255,0,0)";
                }
            }
        }
    },

    makeStars : function(){
        const numberOfStars = 50;
        for (var i = 0; i < numberOfStars; i++) {
            let starShape = Math.floor((Math.random() * 5) + 1);
            starArray.push(new component(starShape,starShape,("rgba(255,255,255," + Math.random() +")"), Math.floor((Math.random() * myGameArea.canvas.width) + 1),Math.floor((Math.random() * myGameArea.canvas.height) + 1),"stars")); 
        }
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
    if(this.type == "gradient"){
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

    this.win = function(obstacle){
        if(this.y < (0 - this.height)){
            return true;
        }
    }


    this.crashWith = function(obstacle){


        let distanceBetweenX = Math.abs(obstacle.x + (obstacle.width/2) - this.x - this.width/2) + 3;
        let distanceBetweenY = Math.abs(obstacle.y + (obstacle.height/2) - this.y - this.height/2) + 3;


        if(distanceBetweenX > (this.width/2 + (obstacle.width/2 + 2))){return false;}
        if(distanceBetweenY > (this.height/2 + (obstacle.width/2 + 2))){return false;}
        if(distanceBetweenX <= this.width/2 && distanceBetweenY <= this.height/2){return true;}

        let dx = distanceBetweenX - (this.width/2 - 5);
        let dy = distanceBetweenY - (this.height/2 - 5);
        if(dx * dx + dy * dy <= ((obstacle.width/2) * (obstacle.width/2))){return true;}
    }

    this.offscreen = function(){
        if(this.x < -this.width || this.x > myGameArea.canvas.width || this.y < 0 || this.y > myGameArea.canvas.height){
            return true;
        } else {
            return false;
        }
    }

    this.noOutOfBounds = function(){
        if(this.x < (myGameArea.canvas.width - myGameArea.canvas.width)){
            this.x = (myGameArea.canvas.width - myGameArea.canvas.width);
            this.speed -= .002;
        }
        if(this.x > (myGameArea.canvas.width - myGamePiece.width)){
            this.x = (myGameArea.canvas.width - myGamePiece.width);
            this.speed -= .002;
        }
        if(this.y > (myGameArea.canvas.height- myGamePiece.height)){
            this.y = (myGameArea.canvas.height- myGamePiece.height);
            this.speed -= .002;
        }
    }

    this.moveSpaceShip = function(){
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
            if (myGameArea.keys && myGameArea.keys[38] && (myGamePiece.speed < 3)) {
                myGamePiece.speed += .03;
                this.animateSpaceship("fullblast") }
                if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed += -.01; }
            }
        }
        // arguments should be: straight, left, right, and fullblast
        this.animateSpaceship = function(direction){
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
}







