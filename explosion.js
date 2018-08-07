this.makeParticles = function(x,y){
        const numberOfParticles = 20;
        for (var i = 0; i < numberOfParticles; i++) {
            particleAngle = 1;
            particles.push(new component(5,5,"white",x,y));
            particles[i].speed = 5;
            particles[i].angle = particleAngle;
            console.log(particles[i].angle);
            console.log(particles[i].speed);

            explode = true;
    
    }
}