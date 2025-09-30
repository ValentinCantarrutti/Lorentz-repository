import * as Phaser from 'phaser';

export default class Ball extends Phaser.GameObjects.Arc {
  constructor(scene, x, y, radius = 18, color = 0xffffff) {
    super(scene, x, y, radius, 0, 360, false, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCircle(radius);
    this.body.setCollideWorldBounds(true, 1, 1);
    this.body.setBounce(1, 1);
    this.body.allowGravity = false;

    // Añadir efecto de brillo
    if (this.scene.sys.game.config.renderType === Phaser.WEBGL) {
        this.postFX.addGlow(0xffffff, 2, 0, false, 0.1, 12);
    }
  }

  launch(initialSpeed = 500) {
    // Solo lanzar si la pelota está quieta
    if (this.body.velocity.length() === 0) {
      // Ángulos de lanzamiento que evitan ir directamente en vertical u horizontal
      const angles = [30, 45, 135, 150, 210, 225, 315, 330];
      const angleDeg = Phaser.Math.RND.pick(angles);
      const angleRad = Phaser.Math.DegToRad(angleDeg);
      
      this.body.setVelocity(
        Math.cos(angleRad) * initialSpeed,
        Math.sin(angleRad) * initialSpeed
      );
    }
  }

  clampSpeed(maxSpeed) {
    const velocity = this.body.velocity;
    if (velocity.length() > maxSpeed) {
      const newVel = velocity.normalize().scale(maxSpeed);
      this.body.setVelocity(newVel.x, newVel.y);
    }
  }
}