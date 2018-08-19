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
            this.astroidType = ["astroid1.png","astroid2.png","astroid3.png","astroid4.png","astroid5.png","astroid6.png" ]
        },

        clear : function(){
            this.context.clearRect(0,0, this.canvas.width,this.canvas.height);
        },

        stop : function(){
            clearInterval(this.interval);
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
                grd.addColorStop(.5, "white");
                grd.addColorStop(1,"black");
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.scale(1,.3);
                ctx.fillStyle = grd;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.restore();
            } else if(this.type == 'circle'){

            }
            else {
                ctx.fillRect(this.x, this.y, this.width, this.height)
            }
        }

        this.newPos = function() {
            this.angle += this.moveAngle * Math.PI / 180;
            this.x += this.speed * Math.sin(this.angle);
            this.y -= this.speed * Math.cos(this.angle);
        }

        this.crashWith = function(obstacle){
            //problems space ship is triangle. Not square.
            //obstacles are unenven blobs ... not squares.
            // let shipFront = this.y;
            // let shipBack = this.y + (this.height);
            // let shipLeft = this.x;
            // let shipRight = this.x + (this.width);
            // let obstacleFront = obstacle.y;
            // let obstacleBack = obstacle.y + (obstacle.height);
            // let obstacleLeft = obstacle.x;
            // let obstacleRight = obstacle.x + (obstacle.width);

            // let obstacleCx = obstacle.x - (obstacle.width/2);
            // let obstacleCy = obstacle.y - (obstacle.height/2);
            // let obstacleR = obstacle.width/2;

            // let crash = false;

            // if((shipFront < obstacleBack) && (shipBack > obstacleFront) && (shipLeft < obstacleRight) && (shipRight > obstacleLeft)){
            //     console.log("ship= " + shipFront,shipBack,shipLeft,shipRight);
            //     console.log("obstacle = " + obstacleFront,obstacleBack,obstacleLeft,obstacleRight);
            //     crash = true;
            // }
            // return crash;

            let distanceBetweenX = Math.abs(obstacle.x + (obstacle.width/2) - this.x - this.width/2);
            //console.log(distanceBetweenX);
            let distanceBetweenY = Math.abs(obstacle.y + (obstacle.height/2) - this.y - this.height/2);
            let crash = false;

            if(distanceBetweenX > (this.width/2 + (obstacle.width/2 + 2))){return crash;}
            if(distanceBetweenY > (this.height/2 + (obstacle.width/2 + 2))){return crash;}
            if(distanceBetweenX <= this.width/2 && distanceBetweenY <= this.height/2){
                console.log(distanceBetweenX);
                console.log('X');
                crash = true;
                return crash;
            }
            // if(distanceBetweenY <=this.height/2){
            //     console.log('Y');
            //     crash = true;
            //     return crash;
            // }
            // let dx = distanceBetweenX - this.width/2;
            // let dy = distanceBetweenY - this.height/2;
            // if(dx * dx + dy * dy <= ((obstacle.width/2) * (obstacle.width/2))){
            //     console.log("strage");
            //     crash = true;
            //     return crash;
            // }
        }

        this.offscreen = function(){
            if(this.x < -this.width || this.x > myGameArea.canvas.width || this.y < 0 || this.y > myGameArea.canvas.height){
                return true;
            } else {
                return false;
            }
        }
    }