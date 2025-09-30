export default class Energy {
  constructor(scene, ball, paddles) {
    this.scene = scene;
    this.ball = ball;
    this.paddles = paddles; // array con las dos paletas
    this.hitCount = 0;

    // Línea energética en la parte inferior
    this.barrier = scene.add.rectangle(
      scene.scale.width / 2,
      scene.scale.height - 42,
      scene.scale.width,
      20,
      0xffffff
    ).setDepth(1);
    scene.physics.add.existing(this.barrier, true);

    const blockWidth = 120;
const blockHeight = 120;
const offsetY = scene.scale.height - 40; // un poco más arriba que la barrera

// Bloque izquierdo
this.leftBlock = scene.add.rectangle(
  0 + blockWidth / 2,
  offsetY,
  blockWidth,
  blockHeight,
  0xffffff
).setDepth(0);
scene.physics.add.existing(this.leftBlock, true);

// Bloque derecho
this.rightBlock = scene.add.rectangle(
  scene.scale.width - blockWidth / 2,
  offsetY,
  blockWidth,
  blockHeight,
  0xffffff
).setDepth(0);
scene.physics.add.existing(this.rightBlock, true)

scene.physics.add.collider(ball, this.leftBlock);
scene.physics.add.collider(ball, this.rightBlock);

    // Texto de contador
    this.text = scene.add.text(10, 10, 'Toques: 0', {
      fontSize: '20px',
      fill: '#19ff11ff'
    });

        this.texto = scene.add.text(225, 10, 'Si la bola toca el campo de energia con 5 toques no la destruye. Presiona R para Reiniciar.', {
      fontSize: '20px',
      fill: '#19ff11ff'
    });

    // Colisión con paletas
    paddles.forEach(paddle => {
      scene.physics.add.collider(ball, paddle, () => {
        this.hitCount++;
        this.text.setText('Toques: ' + this.hitCount);
      });
    });

    // Colisión con la barrera energética
    scene.physics.add.collider(ball, this.barrier, () => {
      if (this.hitCount === 5) {
        console.log('Bola no es destruida');
      } else {
        ball.destroy();
        console.log('Bola es destruida');
      }
    });
  }

  registerHit() {
  this.hitCount++;
  this.text.setText('Toques: ' + this.hitCount );
}
}