var fondo, fondoImg;
var gallina, gallinaImg, gallinaRunImg, gallina3, gallina4;
var sueloImg, suelo, sueloInvisible;
var lobo, loboQuietoImg, loboCorriendoImg;
var obs1Img, obs2Img, obs3Img, obs4Img, obstaculos;
var nub1, nub2, nub3, nubesGroup;

var premios = [];
var maizImg, groupMaiz, recolectar, maizImg2;

var SERVE = 1;
var PLAY = 3;
var END = 0;
var WIN = 2;
var gameState = SERVE;
var score = 0;

var saltar, perder, puntos, ganadora, win2, salto2;

function preload(){
	fondoImg = loadImage("images/bg.jpg");
	gallinaImg = loadImage("images/g2.png");
	gallinaRunImg = loadAnimation("images/g2.png", "images/g1.png", "images/g1.png");
	gallina3 = loadAnimation("images/g3.png");
	gallina4 = loadAnimation("images/g3.png", "images/g3.png",  "images/g3.png", "images/g4.png", "images/g4.png");
	sueloImg = loadImage("images/suelos.jpg");

	loboQuietoImg = loadImage("images/lobo4.png");
	loboCorriendoImg = loadAnimation("images/lobo1.png", "images/lobo2.png", "images/lobo2.png");

	obs1Img = loadImage("images/obj2.png");
	obs2Img = loadImage("images/obj4.png");
	obs3Img = loadImage("images/obj5.png");
	obs4Img = loadImage("images/serpiente.png");

	nub1 = loadImage("images/nube1.png");
	nub2 = loadImage("images/nube2.png");
	nub3 = loadImage("images/nube3.png");

	maizImg = loadImage("images/granos_maiz.png");
	maizImg2 = loadImage("images/maiz.png");

	saltar = loadSound("images/sounds/jump2.mp3");
	perder = loadSound("images/sounds/perder.mp3");
	puntos = loadSound("images/sounds/score.mp3");
	ganadora = loadSound("images/sounds/win.mp3");
	salto2 = loadSound("images/sounds/salto.mp3");
	win2 = loadSound("images/sounds/Win2.mp3")

}

function setup(){
	suelo = createSprite(900, 690, 700, 50);
	suelo.addImage("suelo",sueloImg);
	suelo.scale = 1.3;

	gallina = createSprite(350, 625, 50, 50);
	gallina.addAnimation("esperando", gallinaImg);
	gallina.addAnimation("corriendo", gallinaRunImg);
	gallina.addAnimation("asustada", gallina3);
	gallina.addAnimation("ganando", gallina4);
	gallina.setCollider("rectangle",-5,10,100,150);
	gallina.scale = 0.6;

	lobo = createSprite(100, 615, 50, 50);
	lobo.addAnimation("quieto", loboQuietoImg);
	lobo.addAnimation("corriendo", loboCorriendoImg);
	lobo.scale = 0.5;

	sueloInvisible = createSprite(250, 693, 500, 30);
	sueloInvisible.visible = false;

	obstaculos = new Group();
	groupMaiz = new Group();
	nubesGroup = new Group();
	
}

function draw(){
	//createCanvas(1440, 723);
	createCanvas(windowWidth, windowHeight);
	background(fondoImg);
	
	
	if(gameState === SERVE){
		textSize(20);
		fill("brown");
		textFont("Chalkboard");
		stroke("brown");
		strokeWeight(1.4);
		text("Presiona la tecla derecha para iniciar", 20, 103);
		text("Salta con espacio", 110, 128);

		if(keyDown("RIGHT_ARROW")){
			gameState = PLAY;
		}
	}

	if(gameState === PLAY){

		textSize(35);
		fill("purple");
		textFont("Chalkboard");
		stroke("red");
		strokeWeight(2);
		text("Puntaje: " + score, 575, 71);

		if(suelo.x < 600){
			suelo.x = suelo.width/1.8;
		}

		nubes();

		if(keyDown("RIGHT_ARROW")){
			gallina.changeAnimation("corriendo", gallinaRunImg);
			lobo.changeAnimation("corriendo", loboCorriendoImg);
			lobo.scale = 0.85;
			lobo.setCollider("rectangle",0,0,200,200);
			suelo.velocityX = -4;
		}

		//Niveles
		if(score <= 30){
			obstacles();
			premios.push(premiosGallina());
		}else{
			nivel_2();
			premios.push(premios_2());
		}

		if(keyDown("SPACE") && gallina.y === 627){
			gallina.velocityY = -18;
			saltar.play();
			//salto2.play();
		}

		gallina.velocityY = gallina.velocityY +0.7;
		gallina.collide(sueloInvisible);

		lobo.velocityY = lobo.velocityY +1;
		lobo.collide(sueloInvisible);

		if(obstaculos.isTouching(lobo)){
			lobo.velocityY = -15;
		}

		if(groupMaiz.isTouching(gallina)){
			gallina.isTouching(groupMaiz, groupHit);
			score = score +3;
			puntos.play();
		}

		if(score >= 60){
			win2.play();
			gameState = WIN;
			gallina.changeAnimation("ganando", gallina4);
			lobo.y = 585;
		}

		if(obstaculos.isTouching(gallina)){
			gameState = END;
			perder.play();
		}

	}
	if(gameState === WIN){
		ganar();
		detener();
		gallina.changeAnimation("ganando", gallina4);
		lobo.y = 585;
	}
	else if(gameState === END){
		gameOver();
		detener();
		lobo.x = 270;
	}

	drawSprites();
}

function obstacles(){
	if(frameCount % 120 === 0){
		var obst = createSprite(1600, 680, 50, 50);
		obst.velocityX = -5;
		var rand = Math.round(random(1,4))
		switch(rand){
			case 1: obst.addImage(obs1Img);
			obst.y = 655;
			obst.setCollider("rectangle",0,0,100,50);
			break;
			case 2: obst.addImage(obs2Img);
			obst.y = 645;
			obst.setCollider("rectangle",0,0,100,50);
			break;
			case 3: obst.addImage(obs3Img);
			obst.y = 622;
			obst.scale = 0.8;
			obst.setCollider("rectangle",-5,2,90,120);
			break;
			case 4: obst.addImage(obs4Img);
			obst.scale = 0.2;
			obst.y = 632;
			obst.setCollider("rectangle",-70,0,300,400);
			break;
			default: break;
		}
		obst.lifetime = 700;
		obst.depth = lobo.depth -1;
		obstaculos.add(obst);
	}
}

function premiosGallina(){
	if(frameCount % 100 === 0){
		var maiz = createSprite(1900, random(350, 550), 10, 10);
		maiz.addImage(maizImg);
		maiz.scale = 0.2;
		maiz.velocityX = -5;

		maiz.lifetime = 700;
		groupMaiz.add(maiz);
	}
}

function nubes(){
	if(frameCount % 120 === 0){
		var nube = createSprite(1700, random(50, 180), 50, 50);
		nube.velocityX = -7;
		var rand = Math.round(random(1,3))
		switch(rand){
			case 1: nube.addImage(nub1);
			break;
			case 2: nube.addImage(nub2);
			break;
			case 3: nube.addImage(nub3);
			break;
			default: break;
		}

		nube.lifetime = 600;
		nubesGroup.add(nube);
	}
}

//Nivel 2
function nivel_2(){
	if(frameCount % 60 === 0){
		var obst = createSprite(2600, 680, 50, 50);
		obst.velocityX = -8;
		var rand = Math.round(random(1,4))
		switch(rand){
			case 1: obst.addImage(obs1Img);
			obst.y = 655;
			obst.setCollider("rectangle",0,0,100,50);
			break;
			case 2: obst.addImage(obs2Img);
			obst.y = 645;
			obst.setCollider("rectangle",0,0,100,50);
			break;
			case 3: obst.addImage(obs3Img);
			obst.y = 622;
			obst.scale = 0.8;
			obst.setCollider("rectangle",-5,2,90,120);
			break;
			case 4: obst.addImage(obs4Img);
			obst.scale = 0.2;
			obst.y = 632;
			obst.setCollider("rectangle",-70,0,300,400);
			break;
			default: break;
		}
		obst.lifetime = 700;
		obst.depth = lobo.depth -1;
		obstaculos.add(obst);
	}
}

function premios_2(){
	if(frameCount % 80 === 0){
		var maiz = createSprite(2900, random(350, 550), 10, 10);
		maiz.addImage(maizImg);
		maiz.scale = 0.2;
		maiz.velocityX = -8;

		maiz.lifetime = 700;
		groupMaiz.add(maiz);
	}
}

function ganar(){
	swal({
		title: "¡Ganaste la mazorca de oro!",
		text: "Felicidades",
		imageUrl: "images/maiz.png",
		imageSize: "250x250",
		confirmButtonText: "Volver a jugar"
	},
	function(Confirm){
		if(Confirm){
			location.reload();
		}
	})
}

function detener(){
	suelo.velocityX = 0;
	lobo.changeAnimation("quieto", loboQuietoImg);
	lobo.velocityY = 0;
	lobo.scale = 0.6;
	gallina.changeAnimation("asustada", gallina3);
	gallina.velocityY = 0;
	obstaculos.setVelocityXEach(0);
	obstaculos.setLifetimeEach(-1);

	groupMaiz.setVelocityXEach(0);
	groupMaiz.setLifetimeEach(-1);

	nubesGroup.setVelocityXEach(0);
	nubesGroup.setLifetimeEach(-1);
	
}

function gameOver(){
	swal({
		title: "¡Te atrapó el lobo!",
		text: "Gracias por jugar -" + " Puntaje: " + score,
		imageUrl: "images/g3.png",
		imageSize: "150x150",
		confirmButtonText: "Volver a jugar"
	},
	function(Confirm){
		if(Confirm){
			location.reload();
		}
	})
}

function groupHit(gallina, maiz){
	maiz.destroy();
}