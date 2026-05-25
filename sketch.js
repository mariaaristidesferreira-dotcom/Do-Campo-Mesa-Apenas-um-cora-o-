let veiculos = [];
let nuvens = [];
let drones = [];
let passaros = [];

function setup() {
  createCanvas(800, 500);
  
  // Criar veículos iniciais
  for (let i = 0; i < 8; i++) {
    veiculos.push(new Veiculo());
  }
  
  // Criar nuvens
  for (let i = 0; i < 5; i++) {
    nuvens.push({ x: random(width), y: random(30, 120), s: random(0.5, 1.5) });
  }

  // Criar drones (Tecnologia no Campo)
  for (let i = 0; i < 2; i++) {
    drones.push({ x: random(50, width/2 - 50), y: random(100, 200), angle: 0 });
  }
}

function draw() {
  desenharCenario();
  
  // Movimentar e desenhar Nuvens
  for (let n of nuvens) {
    n.x += 0.3 * n.s;
    if (n.x > width + 50) n.x = -50;
    desenharNuvem(n.x, n.y, n.s);
  }

  // Desenhar Drones (Conexão Tecnológica)
  for (let d of drones) {
    d.x += sin(d.angle) * 2;
    d.angle += 0.05;
    fill(50);
    rect(d.x, d.y, 20, 5);
    fill(0, 255, 0);
    ellipse(d.x + 10, d.y, 3, 3); // Luz piscante
    textSize(12);
    text("📡", d.x + 5, d.y - 5);
  }

  // Estrada Central (A Conexão)
  desenharEstrada();

  // Atualizar e desenhar veículos
  for (let v of veiculos) {
    v.update();
    v.display();
  }

  desenharInterface();
}

function desenharCenario() {
  // Céu Dinâmico (Ciclo Dia/Noite suave)
  let val = map(sin(frameCount * 0.01), -1, 1, 0, 1);
  let corCeu = lerpColor(color(10, 20, 50), color(135, 206, 235), val);
  background(corCeu);

  // Sol / Lua
  let sunY = map(sin(frameCount * 0.01), -1, 1, height/2, 50);
  fill(255, 255, 150);
  noStroke();
  ellipse(width/2, sunY, 60, 60);

  // LADO DO CAMPO
  fill(34, 139, 34); 
  rect(0, height/2, width/2, height/2);
  
  // Plantação em camadas
  for(let x=30; x < width/2 - 20; x+=50) {
    for(let y=height/2 + 80; y < height; y+=40) {
      fill(218, 165, 32);
      ellipse(x, y, 15, 20); // Milho/Trigo
      fill(0, 100, 0, 50);
      ellipse(x, y+10, 20, 5); // Sombra
    }
  }

  // LADO DA CIDADE
  fill(80, 90, 110);
  rect(width/2, height/2, width/2, height/2);
  
  // Prédios com profundidade
  for(let i = width/2 + 40; i < width; i += 80) {
    let h = (noise(i) * 200) + 50;
    fill(40, 50, 70);
    rect(i, height/2 - h + 50, 60, h);
    
    // Janelas que acendem à noite
    fill(val < 0.5 ? color(255, 255, 150) : color(20, 30, 50));
    for(let wx = i+10; wx < i+50; wx+=15) {
      for(let wy = height/2 - h + 70; wy < height/2 + 30; wy+=20) {
        rect(wx, wy, 8, 8);
      }
    }
  }
}

function desenharEstrada() {
  fill(40);
  noStroke();
  rect(0, height/2 + 20, width, 60);
  stroke(255, 200, 0);
  strokeWeight(2);
  drawingContext.setLineDash([20, 20]);
  line(0, height/2 + 50, width, height/2 + 50);
  drawingContext.setLineDash([]);
  noStroke();
}

function desenharNuvem(x, y, s) {
  fill(255, 230);
  noStroke();
  ellipse(x, y, 40 * s, 25 * s);
  ellipse(x + 15, y + 5, 30 * s, 20 * s);
  ellipse(x - 10, y + 5, 30 * s, 20 * s);
}

function desenharInterface() {
  fill(0, 180);
  rect(0, 0, width, 60);
  fill(255);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(22);
  text("🌱 CAMPO E CIDADE: CONEXÕES QUE TRANSFORMAM 🏙️", width/2, 38);
  
  textSize(14);
  textStyle(NORMAL);
  fill(200, 255, 200);
  text("Clique para gerar novos recursos e veículos!", width/2, height - 20);
}

function mousePressed() {
  veiculos.push(new Veiculo());
}

class Veiculo {
  constructor() {
    this.reset();
    this.x = random(width);
  }

  reset() {
    this.x = -60;
    this.y = height/2 + 45;
    this.speed = random(2, 4);
    this.tipoOriginal = random(["🚜", "🌾", "🐄", "🍎"]);
    this.tipo = this.tipoOriginal;
    this.conectado = false;
  }

  update() {
    this.x += this.speed;
    
    // LOGICA DE TRANSFORMAÇÃO (A Conexão)
    if (this.x > width/2 && !this.conectado) {
      if (this.tipo === "🚜") this.tipo = "🏗️";
      if (this.tipo === "🌾") this.tipo = "🍞";
      if (this.tipo === "🐄") this.tipo = "🥛";
      if (this.tipo === "🍎") this.tipo = "🧃";
      this.conectado = true;
    }

    if (this.x > width + 60) this.reset();
  }

  display() {
    // Sombra do veículo
    fill(0, 50);
    ellipse(this.x, this.y + 10, 40, 10);
    
    // Desenho do item/veículo
    textAlign(CENTER);
    textSize(35);
    text(this.tipo, this.x, this.y);
    
    // Partículas de "Energia de Conexão"
    if(this.conectado) {
      fill(0, 255, 255, 150);
      for(let i=0; i<3; i++) {
        ellipse(this.x - random(20, 40), this.y - random(0, 20), 4, 4);
      }
    }
  }
}