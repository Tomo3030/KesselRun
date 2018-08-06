function explosion(x,y) {
	let particles = []
	const numberOfParticles = 20;

	for (var i = 0; i < numberOfParticles; i++) {
		particles.push(new component(5,5,"white",x,y)
	}

	for (var i = 0; i < particles.length; i++) {
		//make a randome angle
		randAngle = Math.PI/180 * ((Math.random() * Math.PI) + Math.PI);
		//assign it to the particle
		particles[i].angle = randAngle;
		particles[i].speed = 5;
		particles[i].updateTurn();



	}