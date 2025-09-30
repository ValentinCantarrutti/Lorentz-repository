import * as Phaser from 'phaser';
import ClassPaletas from '../Objects/ClassPaletas.js';
import Ball from '../Objects/Ball.js';
import BlockRow from '../Objects/BlockRow.js'; 
import Energy from '../Objects/Energy.js';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');
    }

    create ()
    {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const wallPadding = 150;

        this.scoreLeft = 0;
        this.scoreRight = 0;

        this.scoreTextLeft = this.add.text(50, 20, 'Jugador 1: 0', { fontSize: '24px', fill: '#00f' });
        this.scoreTextRight = this.add.text(this.cameras.main.width - 200, 20, 'Jugador 2: 0', { fontSize: '24px', fill: '#f00' });

        this.add.image(screenWidth / 2, screenHeight / 2, "background").setOrigin(0.5).setDepth(0).setScale(2);
        
        this.player1 = new ClassPaletas(this, wallPadding, screenHeight / 2, 35, 170, 0x0000ff, 'player1'); 
        this.player2 = new ClassPaletas(this, screenWidth - wallPadding, screenHeight / 2, 35, 170, 0xff0000, 'player2');

        this.ball = new Ball(this, screenWidth / 2, screenHeight / 2);
        this.ball.launch(); // Lanzar la pelota al iniciar

        // Colisión entre la pelota y las paletas
        this.physics.add.collider(this.ball, this.player1.hitboxGroup, this.handlePaddleBallCollision, null, this);
        this.physics.add.collider(this.ball, this.player2.hitboxGroup, this.handlePaddleBallCollision, null, this);

          this.blockRow = new BlockRow(this, {
        count: 5,
        startX: 320,
        startY: 60,
        color: 0xffffff
        });

    this.blockRow.enableCollision(this.ball);

    this.energy = new Energy(this, this.ball, [this.player1.hitboxGroup, this.player2.hitboxGroup]);

        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }

    handlePaddleBallCollision(ball, hitbox) {
        // Encontrar a qué jugador pertenece la hitbox
        const paddleObject = (this.player1.hitboxes.includes(hitbox)) ? this.player1 : this.player2;
        const paddleBody = paddleObject.player;

        // 1. Calcular el punto de impacto relativo en la paleta (-1 a 1)
        const impactPoint = Phaser.Math.Clamp((ball.y - paddleBody.y) / (paddleBody.height / 2), -1, 1);
        
        // 2. Calcular el ángulo de rebote basado en el punto de impacto y la rotación de la paleta
        const maxBounceAngle = 75; // Grados
        const bounceAngleDeg = impactPoint * maxBounceAngle;
        const finalBounceAngleRad = Phaser.Math.DegToRad(bounceAngleDeg + paddleBody.angle);

        // 3. Normalizar el vector de dirección y aplicar velocidad
        const speed = 600; // Velocidad constante después del rebote
        const direction = (ball.x < this.cameras.main.width / 2) ? 1 : -1; // Dirección del rebote (derecha o izquierda)

        const newVx = speed * Math.cos(finalBounceAngleRad) * direction;
        const newVy = speed * Math.sin(finalBounceAngleRad);

        ball.body.setVelocity(newVx, newVy);
        ball.clampSpeed(900); // Limitar la velocidad máxima por si acaso

        if (this.energy) {
         this.energy.registerHit();
        }
    }

     update(time, delta) {
        this.player1.update(time, delta);
        this.player2.update(time, delta);

        // Lógica de reinicio de punto (ejemplo básico)
        if (this.ball.x < 0 || this.ball.x > this.cameras.main.width) {
            this.scene.restart();
        }

    }

    
}