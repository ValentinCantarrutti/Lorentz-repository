import * as Phaser from 'phaser';

export default class ClassPaletas {
    constructor(scene) {
        this.scene = scene;

        // Propiedades del jugador
        this.playerSpeed = 200;
        this.playerRotationSpeed = 3; // Grados por segundo

        // Crear el jugador visual (el rectángulo)
        this.player = this.scene.add.rectangle(400, 300, 100, 20, 0x00ff00);

        // Crear los círculos de la hitbox
        this.hitboxGroup = this.scene.physics.add.group();

        this.hitboxRadius = 10;
        this.hitboxOffset = 50; // Distancia desde el centro del rectángulo

        this.hitbox1 = this.scene.add.circle(0, 0, this.hitboxRadius, 0xff0000);
        this.hitbox2 = this.scene.add.circle(0, 0, this.hitboxRadius, 0xff0000);
        this.hitbox3 = this.scene.add.circle(0, 0, this.hitboxRadius, 0xff0000);
        this.hitbox4 = this.scene.add.circle(0, 0, this.hitboxRadius, 0xff0000);

        // Agregar los círculos al grupo de física
        this.scene.physics.add.existing(this.hitbox1);
        this.scene.physics.add.existing(this.hitbox2);
        this.scene.physics.add.existing(this.hitbox3);
        this.scene.physics.add.existing(this.hitbox4);

        this.hitboxGroup.addMultiple([this.hitbox1, this.hitbox2, this.hitbox3, this.hitbox4]);
        this.hitboxGroup.children.each(child => {
            child.body.setCircle(this.hitboxRadius);
            child.body.setImmovable(true);
        });
        
        // Crear un objeto de ejemplo con el que la hitbox chocará
        let obstacle = this.scene.add.rectangle(600, 300, 50, 50, 0xcccccc);
        this.scene.physics.add.existing(obstacle);
        obstacle.body.setImmovable(true);

        // Detectar colisiones entre la hitbox y el obstáculo
        this.scene.physics.add.collider(this.hitboxGroup, obstacle, () => {
            console.log('¡Colisión detectada!');
            this.player.fillColor = 0xffff00; // Cambiar color al colisionar
        });

        // Configurar los controles del teclado
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        // Resetear el color
        this.player.fillColor = 0x00ff00;

        // Movimiento del jugador
        if (this.cursors.left.isDown) {
            this.player.angle -= this.playerRotationSpeed;
        } else if (this.cursors.right.isDown) {
            this.player.angle += this.playerRotationSpeed;
        }

        if (this.cursors.up.isDown) {
            const speed = this.playerSpeed * (delta / 1000);
            this.player.x += Math.cos(Phaser.Math.DegToRad(this.player.angle)) * speed;
            this.player.y += Math.sin(Phaser.Math.DegToRad(this.player.angle)) * speed;
        } else if (this.cursors.down.isDown) {
            const speed = this.playerSpeed * (delta / 1000);
            this.player.x -= Math.cos(Phaser.Math.DegToRad(this.player.angle)) * speed;
            this.player.y -= Math.sin(Phaser.Math.DegToRad(this.player.angle)) * speed;
        }

        // Actualizar la posición de los círculos de la hitbox
        const angleRad = Phaser.Math.DegToRad(this.player.angle);

        const frontX = this.player.x + Math.cos(angleRad) * this.hitboxOffset;
        const frontY = this.player.y + Math.sin(angleRad) * this.hitboxOffset;

        const backX = this.player.x - Math.cos(angleRad) * this.hitboxOffset;
        const backY = this.player.y - Math.sin(angleRad) * this.hitboxOffset;

        const topX = this.player.x + Math.cos(angleRad + Math.PI / 2) * this.hitboxOffset / 2;
        const topY = this.player.y + Math.sin(angleRad + Math.PI / 2) * this.hitboxOffset / 2;

        const bottomX = this.player.x + Math.cos(angleRad - Math.PI / 2) * this.hitboxOffset / 2;
        const bottomY = this.player.y + Math.sin(angleRad - Math.PI / 2) * this.hitboxOffset / 2;
        
        this.hitbox1.setPosition(frontX, frontY);
        this.hitbox2.setPosition(backX, backY);
        this.hitbox3.setPosition(topX, topY);
        this.hitbox4.setPosition(bottomX, bottomY);

        // Sincronizar los cuerpos de física con los game objects
        this.hitboxGroup.children.each(child => {
            child.body.x = child.x - this.hitboxRadius;
            child.body.y = child.y - this.hitboxRadius;
        });
    }
}