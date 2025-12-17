// sound effects laden
function preload() {
  ping_pong_pang = loadSound("ping pong pang ping.mp3");
  failsound = loadSound("failsound.ogg");
  applause = loadSound("applause.ogg");
  dingding = loadSound("sectionpass.ogg");
  tung1 = loadSound("tung1.wav");
  tung2 = loadSound("tung2.wav");
}

class Racket {
  constructor(x) {
    this.x = x;
    this.y = 125;
    this.width = 10;
    this.height = 125;
    this.vy = 0;
  }

  toon() {
    fill("blue");
    rect(this.x, this.y, this.width, this.height);
  }

  beweeg(a, b) {
    if (keyIsDown(a)) {
      this.y -= beweegSnelheid;
      this.vy = 5;
    }

    if (keyIsDown(b)) {
      this.y += beweegSnelheid;
      this.vy = 5;
    }

    this.y = constrain(this.y, 0, canvas.height - this.height);
  }
}

class Bal {
  constructor(x, y, a, b) {
    this.x = x;
    this.y = y;
    this.snelheid_x = 5;
    this.snelheid_y = 4.5;
    this.diameter = 15;
    this.straal = this.diameter / 2;
    this.lading_x = a;
    this.lading_y = b;
  }

  toon() {
    fill("white");
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  beweeg(x, y) {
    this.y += y;
    this.x += x;

    // lading wordt willekeurig bepaald, als lading < 0 dan gaat de bal naar links ipv rechts
    if (this.lading_x < 0) {
      this.snelheid_x *= -1;
      this.lading_x = null;
    }

    // lading wordt willekeurig bepaald, als lading < 0 dan gaat de bal naar onder ipv boven
    if (this.lading_y < 0) {
      this.snelheid_y *= -1;
      this.lading_y = null;
    }

    // als de bal van het scherm af gaat
    if (this.x <= this.straal || this.x >= canvas.width - this.straal) {
      verloren = 1;
      failsound.play();
    }

    // als de bal de bovenkant of onderkant van het scherm raakt
    if (this.y <= this.straal || this.y >= canvas.height - this.straal) {
      this.snelheid_y *= -1;
      this.snelheid_x *= 1;

      // willekeurig 1 van de 2 tung sound effects spelen
      var tung = [tung1, tung2];
      var keuze = random(tung);
      keuze.play();
    }

    // als de bal een racket raakt
    if (
      this.x + this.straal >= racket2.x &&
      this.x - this.straal <= racket2.x + racket2.width &&
      this.y + this.straal >= racket2.y &&
      this.y - this.straal <= racket2.y + racket2.height &&
      this.snelheid_x > 0
    ) {
      this.x = racket2.x - this.straal;
      this.snelheid_x *= random(-1.01, -1.05);

      // y snelheid na een botsing een klein beetje afhankelijk maken van waar op de racket het de racket raakt
      var midden2 = racket2.y + racket2.height / 2;
      var afstandVanafMidden2 = this.y - midden2;
      var verhouding2 = afstandVanafMidden2 / (racket2.height / 2);

      this.snelheid_y += verhouding2 * 0.5;
      this.snelheid_y += random(-1, 1); // beetje randomness om te voorkomen dat de bal steeds in herhaling de rackets tikt                                            zonder dat je iets hoeft te doen
      this.snelheid_y += racket2.vy * 0.6;

      score++;
      ping_pong_pang.play();
    }

    // hetzelfde als hiervoor maar dan andere racket
    if (
      this.x - this.straal <= racket1.x + racket1.width &&
      this.x + this.straal >= racket1.x &&
      this.y + this.straal >= racket1.y &&
      this.y - this.straal <= racket1.y + racket1.height &&
      this.snelheid_x < 0
    ) {
      this.x = racket1.x + racket1.width + this.straal;
      this.snelheid_x *= random(-1.01, -1.05);

      var midden = racket1.y + racket1.height / 2;
      var afstandVanafMidden = this.y - midden;
      var verhouding = afstandVanafMidden / (racket1.height / 2);

      this.snelheid_y = verhouding * 0.5;
      this.snelheid_y += random(-1, 1);
      this.snelheid_y += racket1.vy * 0.6;

      score++;
      ping_pong_pang.play();
    }
  }
}

class Glitch {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    // willekeurige tint groen
    this.r = random(0, 50);
    this.g = random(160, 255);
    this.b = random(0, 50);
  }

  toon() {
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.width, this.height);
  }
}

function setup() {
  canvas = createCanvas(1000, 400);
  textFont("Verdana");
  textSize(40);
  noStroke();
  frameRate(50);

  racket1 = new Racket(100);
  racket2 = new Racket(900);

  score = 0;
  teller = 1;
  level = 1;
  verloren = 0;
  gewonnen = 0;
  verslagen = 0;
  beweegSnelheid = 7;

  glitchArray = [];

  bal = new Bal(500, 200, random(-1, 1), random(-1, 1)); // bal spawned altijd in het midden met willekeurige lading
}

function draw() {
  background("black");
  fill("white");
  racket1.toon();
  racket2.toon();
  racket1.beweeg(87, 83);
  racket2.beweeg(UP_ARROW, DOWN_ARROW);

  textSize(40);
  fill("white");
  text("Level: " + level + "  " + "Score: " + score, 75, 50);

  bal.toon();
  bal.beweeg(bal.snelheid_x, bal.snelheid_y);

  // rackets gaan steeds slomer bewegen tot level 3, daarna zelfde snelheid
  if (level < 4) {
    beweegSnelheid = 10 - level;
  } else {
    beweegSnelheid = 7;
  }

  if (teller == score) {
    teller += 1;
    glitchArray.push(
      new Glitch(
        // willekeurige locatie
        random(10, 950),
        random(10, 350),

        // steeds grotere glitches elk level
        random(10 * level, 30 * level),
        random(10 * level, 30 * level)
      )
    );
  }

  for (var b = 0; b < glitchArray.length; b++) {
    glitchArray[b].toon();
  }

  // als level behaald is (10 score + 2 per level), win het level of versla het spel als het level 5 is
  if (score == 10 + level * 2) {
    if (level != 5) {
      score = 0;
      gewonnen = 1;
      dingding.play();
    } else {
      score = 0;
      verslagen = 1;
      applause.play();
    }
  }

  // bal en rackets terug op zijn plaats zetten en zorgen dat ze niet kunnen bewegen tijdens een ander scherm
  if (gewonnen == 1) {
    winScherm();
    bal.x = 500;
    bal.y = 200;
    racket1.y = 125;
    racket2.y = 125;
  }

  if (verslagen == 1) {
    spelVerslagen();
    bal.x = 500;
    bal.y = 200;
    racket1.y = 125;
    racket2.y = 125;
  }

  if (verloren == 1) {
    eindScherm();
    bal.x = 500;
    bal.y = 200;
    racket1.y = 125;
    racket2.y = 125;
  }
}

function eindScherm() {
  glitchArray = [];
  background("white");
  fill("black");
  textSize(140);
  text("VERLOREN!", 75, 150);
  textSize(50);
  text("Level: " + level + "  Score: " + score, 75, 250);
  textSize(40);
  text("Druk op ENTER om opnieuw te proberen", 75, 350);

  // reset spel
  if (keyIsDown(ENTER)) {
    score = 0;
    verloren = 0;
    teller = 1;
    level = 1;

    bal.snelheid_x = 5;
    bal.snelheid_y = 4.5;
    bal.lading = random(-1, 1);
  }
}

function winScherm() {
  glitchArray = [];

  background("green");
  fill("white");
  textSize(100);
  text("Level " + level + " gehaald!", 75, 150);

  fill("white");
  textSize(40);
  text("Druk op ENTER om naar level " + (level + 1) + " te gaan", 75, 325);

  // volgend level
  if (keyIsDown(ENTER)) {
    score = 0;
    gewonnen = 0;
    teller = 1;
    level++;

    bal.snelheid_x = 4.5 + level * 0.5;
    bal.snelheid_y = 4.0 + level * 0.5;
    bal.lading = random(-1, 1);
  }
}

function spelVerslagen() {
  glitchArray = [];

  background("green");
  fill("white");
  textSize(50);
  text("Je hebt het spel verslagen!", 75, 150);

  fill("white");
  textSize(40);
  text("Druk op ENTER om de bonus levels te spelen", 75, 325);

  // volgend level
  if (keyIsDown(ENTER)) {
    score = 0;
    verslagen = 0;
    teller = 1;
    level++;

    bal.snelheid_x = 4.5 + level * 0.5;
    bal.snelheid_y = 4.0 + level * 0.5;
    bal.lading = random(-1, 1);
  }
}
