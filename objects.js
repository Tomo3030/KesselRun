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
        },

        clear : function(){
            this.context.clearRect(0,0, this.canvas.width,this.canvas.height);
        },

        stop : function(){
            clearInterval(this.interval);
        }
    }

    function component(width, height, color, x, y, type){
        this.type = type;
        if(this.type == "image"){
            this.image = new Image();
            this.image.src = color;
            this.cropPosX = 0;
            this.cropPosY = 0;
        } else{
            this.color = color;
        }
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.moveAngle = 0;
        this.speed = 0;
        this.particles = [];

        
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
                ctx.drawImage(this.image,this.cropPosX,this.cropPosY,28,36, this.width / -2, this.height / -2, this.width, this.height);
                ctx.restore();
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
            //because of the updateTurn function you need to get the proper paremeter of the obstacle you need to times
            // the game piece by half its own height or width.
            let front = (this.y) - (this.height/2.3);
            let back = this.y + (this.height/2.3);
            let left = this.x - (this.height/2.3);
            let right = this.x + (this.width/2.3);
            let obstacleFront = obstacle.y;
            let obstacleBack = obstacle.y + (obstacle.height);
            let obstacleLeft = obstacle.x;
            let obstacleRight = obstacle.x + (obstacle.width);
            let crash = false;

            if((front < obstacleBack) && (left < obstacleRight) && (right > obstacleLeft) && (back > obstacleFront)){
                crash = true;
            }
            return crash; 
        }

        this.offscreen = function(){
            if(this.x < -this.width || this.x > myGameArea.canvas.width || this.y < 0 || this.y > myGameArea.canvas.height){
                return true;
            } else {
                return false;
            }
        }
    }