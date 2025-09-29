import * as Phaser from 'phaser';

export default class ClassPaletas {
    constructor(scene, x, y, width, height, color, playerType) {
        this.scene = scene;

        // Propiedades del jugador
        this.playerSpeed = 325;
        this.playerRotationSpeed = 3; // Grados por segundo

        // Crear el jugador visual (el rectángulo) con los nuevos parámetros
        this.player = this.scene.add.rectangle(x, y, width, height, color);
        this.initialColor = color; // Guardar el color inicial para resetearlo

        // Crear los círculos de la hitbox
        this.hitboxGroup = this.scene.physics.add.group();
        this.hitboxRadius = height / 2; // El radio se ajusta a la mitad de la altura de la paleta

        // Almacenar las hitboxes y sus desplazamientos
        this.hitboxes = [];
        this.hitboxOffsets = [];

        // Calcular dinámicamente el número y la posición de las hitboxes según el ancho
        const numHitboxes = Math.max(2, Math.floor(width / (this.hitboxRadius * 2)));
        const halfWidth = width / 2 - this.hitboxRadius;

        for (let i = 0; i < numHitboxes; i++) {
            const offset = (numHitboxes === 1) ? 0 : -halfWidth + (i / (numHitboxes - 1)) * (halfWidth * 2);
            this.hitboxOffsets.push(offset);

            const hitbox = this.scene.add.circle(0, 0, this.hitboxRadius, 0xff0000);
            hitbox.setVisible(false); // Ocultar las bolas de hitbox
            this.scene.physics.add.existing(hitbox);
            this.hitboxes.push(hitbox);
        }

        this.hitboxGroup.addMultiple(this.hitboxes);
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

        // Configurar los controles del teclado según el tipo de jugador
        if (playerType === 'player1') {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        } else if (playerType === 'player2') {
            this.cursors = this.scene.input.keyboard.addKeys({
                up: 'W',
                down: 'S',
                left: 'A',
                right: 'D'
            });
        }
    }

    update(time, delta) {
        // Resetear el color al color inicial
        this.player.fillColor = this.initialColor;

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

        // Actualizar la posición de los círculos de la hitbox para que sigan a la paleta
        const angleRad = Phaser.Math.DegToRad(this.player.angle);
        const cosAngle = Math.cos(angleRad);
        const sinAngle = Math.sin(angleRad);

        for (let i = 0; i < this.hitboxes.length; i++) {
            const hitbox = this.hitboxes[i];
            const offset = this.hitboxOffsets[i];

            // Calcular la posición de la hitbox relativa al centro y rotación de la paleta
            const newX = this.player.x + offset * cosAngle;
            const newY = this.player.y + offset * sinAngle;
            
            hitbox.setPosition(newX, newY);
        }

        // Sincronizar los cuerpos de física con los game objects
        this.hitboxGroup.children.each(child => {
            child.body.x = child.x - this.hitboxRadius;
            child.body.y = child.y - this.hitboxRadius;
        });
    }
}