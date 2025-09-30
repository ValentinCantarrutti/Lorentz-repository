import * as Phaser from 'phaser';

export default class BlockRow {
  constructor(scene, config = {}) {
    this.scene = scene;

    // Configuración por defecto
    const {
      count = 8,
      numRows = 3,
      blockWidth = 320,
      blockHeight = 62,
      startX = 100,
      startY = 100,
      spacing = 25,
      color = 0xff4444
    } = config;

    this.blocks = this.scene.physics.add.group();

    for (let row = 0; row < numRows; row++) {
  for (let i = 0; i < count; i++) {
    const x = startX + i * (blockWidth + spacing);
    const y = startY + row * (blockHeight + spacing);

    const block = this.scene.add.rectangle(x, y, blockWidth, blockHeight, color).setOrigin(0.5);
    this.scene.physics.add.existing(block);
    block.body.setImmovable(true);
    block.body.setAllowGravity(false);
    block.setData('isBlock', true);

    this.blocks.add(block);
  }
}
}

  enableCollision(ball) {
    this.scene.physics.add.collider(ball, this.blocks, (ball, block) => {
      if (block.getData('isBlock')) {
        block.destroy(); // 💥 romper el bloque
      }
    });
  }
}