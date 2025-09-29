export default class ClassPaletas {
  constructor(scene) {
    this.scene = scene;
    this.sprite = scene.add.rectangle(400, 552, 125, 20, 0xff00022);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setImmovable(true);
    this.sprite.body.setCollideWorldBounds(true);
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    const body = this.sprite.body;
    if (this.cursors.left.isDown) {
      body.setVelocityX(-420);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(420);
    } else {
      body.setVelocityX(0);
    }
  }
}