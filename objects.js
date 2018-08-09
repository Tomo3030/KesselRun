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
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.moveAngle = 0;
        this.speed = 0;
        
        this.update = function(){
            ctx = myGameArea.context;
            if(this.type == 'text'){
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText(this.text, this.x, this.y);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }


            this.updateTurn = function(){
             ctx = myGameArea.context;
             ctx.save();
             ctx.translate(this.x, this.y);
             ctx.rotate(this.angle);
             ctx.fillStyle = color;
             ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
             ctx.restore();  
         }

         this.newPos = function() {
            this.angle += this.moveAngle * Math.PI / 180;
            this.x += this.speed * Math.sin(this.angle);
            this.y -= this.speed * Math.cos(this.angle);
        }

    //in this function need to put an x,y which will be the x,y of the particles. 
    this.makeParticles = function(x,y){
        const numberOfParticles = 20;
        for (var i = 0; i < numberOfParticles; i++) {
            particles.push(new component(5,5,"white",x,y));
        }

        for (var i = 0; i < particles.length; i++) {
            particleAngle += 1;
            particles[i].speed = 1;
            particles[i].angle = particleAngle;
            //console.log(particles[i].angle);
            //console.log(particles[i].speed); 
        }
        explode = true;
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