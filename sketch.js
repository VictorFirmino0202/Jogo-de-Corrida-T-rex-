var INICIAL = 1;
var FINAL = 2;
var EstadoJogo = INICIAL;

var arqueiro, arqueiro_correndo, arqueiro_colidindo;
var bg;
var solo, terreno;
var soloInvisivel;
var obstaculo, obstaculo2;
var pontos;

var GrupoDeObstaculo;

var morte;
var reiniciar;

var som_pulo, som_morte, som_tempo;

function preload() {
  //Chama as animacoes e imagens
  arqueiro_correndo = loadAnimation(
    "correndoD1.png",
    "correndoD2.png",
    "CorrendoD3.png",
    "CorrendoD4.png",
    "CorrendoD5.png",
    "CorrendoD6.png",
    "CorrendoD7.png",
    "CorrendoD8.png");
  arqueiro_colidindo = loadAnimation("morto.png");

  bg = loadImage("fundo.jpg");

  terreno = loadImage("ground2.png");



  obstaculo2 = loadImage("pedra.png");


  reiniciar = loadImage("restart.png");
  fim = loadImage("gameOver.png");

  imgreiniciar = loadImage("restart.png");
  imgfim = loadImage("gameOver.png");

  som_pulo = loadSound("jump.mp3");
  som_morte = loadSound("die.mp3");
  som_tempo = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);

 

  //cria um sprite do  solo
  solo = createSprite(300, 150, 600, 30);
  solo.addImage("terreno", terreno);
  solo.fill = "black";
  solo.x = solo.width / 2;

    //criar um sprite do arqueiro
    arqueiro = createSprite(50, 140, 20, 50);
    arqueiro.addAnimation("correndo", arqueiro_correndo);
    arqueiro.addAnimation("colidindo", arqueiro_colidindo);
    arqueiro.scale = 0.8;

  soloInvisivel = createSprite(300, 170, 600, 30);
  soloInvisivel.visible = false;

  pontos = 0;

  arqueiro.setCollider("circle", 0, 0, 25);
  arqueiro.debug = false;

  fim = createSprite(300, 100);
  fim.addImage(imgfim);

  reiniciar = createSprite(300, 140);
  reiniciar.addImage(imgreiniciar);

  fim.scale = 0.5;
  reiniciar.scale = 0.5;

 

  GrupoDeObstaculo = createGroup();
 
}

function draw() {
  background(bg);

  text(" Score " + pontos, 520, 30);

  if (EstadoJogo === INICIAL) {
    Obstaculos();

    arqueiro.velocityY = arqueiro.velocityY + 2;

    solo.velocityX = -(3 + pontos / 500);

    pontos = pontos + Math.round(frameCount / 60);

    fim.visible = false;
    reiniciar.visible = false;

    SomMarcacao();

    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }

    if (keyDown("space") && arqueiro.y >= 130) {
      arqueiro.velocityY = -18;
      som_pulo.play();
    }

    if (GrupoDeObstaculo.isTouching(arqueiro)) {
      EstadoJogo = FINAL;
      som_morte.play();
      //arqueiro.velocityY = -20;
      //som_pulo.play();
    }
  } else if (EstadoJogo === FINAL) {
    solo.velocityX = 0;

    fim.visible = true;
    reiniciar.visible = true;

    GrupoDeObstaculo.setLifetimeEach(-1);

    if (mousePressedOver(reiniciar)) {
      Reset();
    }

    GrupoDeObstaculo.setVelocityXEach(0);

    arqueiro.changeAnimation("colidindo", arqueiro);
  }

  //Cria uma gravidade adicionando velocidade Y para baixo ao arqueiro

  // Faz o arqueiro se colidir com o solo
  arqueiro.collide(soloInvisivel);

  //Desenha na tela
  drawSprites();
}


function Obstaculos() {
  if (frameCount % 100 === 0) {
    obstaculo = createSprite(600, 150, 25, 25);
    obstaculo.velocityX = -(8 + pontos / 500);

    var aleatoria = Math.round(random(1, 6));
    switch (aleatoria) {
      case 1:
        obstaculo.addImage(obstaculo2);
        break;

      case 2:
        obstaculo.addImage(obstaculo2);
        break;

      default:
        break;
    }

    obstaculo.scale = 0.1;

    obstaculo.lifetime = 300;

    obstaculo.setCollider("circle", 0, 0, 130);
    obstaculo.debug = false;

    GrupoDeObstaculo.add(obstaculo);
  }
}

function SomMarcacao() {
  if (pontos % 500 === 0 && pontos > 0) {
    som_tempo.play();
  }
}

function Reset() {
  EstadoJogo = INICIAL;
  pontos = 0;
  arqueiro.changeAnimation("correndo", arqueiro_correndo);
  GrupoDeObstaculo.destroyEach();
}
