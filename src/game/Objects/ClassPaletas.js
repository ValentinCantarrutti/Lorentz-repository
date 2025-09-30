import * as Phaser from 'phaser';

export default class ClassPaletas {
    constructor(scene, x, y, width, height, color, playerType) {
        this.scene = scene;

        // Propiedades del jugador
        this.playerSpeed = 325;
        this.playerRotationSpeed = 3; // Grados por segundo
        this.maxRotationAngle = 55; // Límite de rotación en grados

        // Crear el jugador visual (el rectángulo) con los nuevos parámetros
        this.player = this.scene.add.rectangle(x, y, width, height, 0xffffff); // Paleta siempre blanca
        this.scene.physics.add.existing(this.player);
        this.player.body.setImmovable(true);
        this.player.body.setCollideWorldBounds(true);
        this.initialColor = 0xffffff; // Guardar el color inicial para resetearlo

       
        // Crear los círculos de la hitbox
        this.hitboxGroup = this.scene.physics.add.group();
        this.hitboxRadius = width / 2; // El radio se ajusta a la mitad del ANCHO de la paleta

        // Almacenar las hitboxes y sus desplazamientos
        this.hitboxes = [];
        this.hitboxOffsets = [];

        // Calcular dinámicamente el número y la posición de las hitboxes según el ALTO
        const densityFactor = 1.5; // Aumenta la densidad (más hitboxes por unidad de alto)
        const numHitboxes = Math.max(2, Math.floor(height / (this.hitboxRadius * 2 / densityFactor)));
        const halfHeight = height / 2 - this.hitboxRadius;

        for (let i = 0; i < numHitboxes; i++) {
            const offset = (numHitboxes === 1) ? 0 : -halfHeight + (i / (numHitboxes - 1)) * (halfHeight * 2);
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
            child.body.setCollideWorldBounds(true); // <-- Add this line
        });
        
        // --- SECCIÓN ELIMINADA ---
        // Ya no se necesita el obstáculo de ejemplo ni su collider.
        // La colisión con la pelota se manejará en Game.js

        // Configurar los controles del teclado según el tipo de jugador
        if (playerType === 'player2') {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        } else if (playerType === 'player1') {
            this.cursors = this.scene.input.keyboard.addKeys({
                up: 'W',
                down: 'S',
                left: 'A',
                right: 'D'
            });
        }
    }

    update(time, delta) {
        // Resetear el color al color inicial (no necesario si se usa glow)
        // this.player.fillColor = this.initialColor;

        // Movimiento del jugador: Rotación con izquierda/derecha
        if (this.cursors.left.isDown) {
            this.player.angle -= this.playerRotationSpeed;
        } else if (this.cursors.right.isDown) {
            this.player.angle += this.playerRotationSpeed;
        }

        // Limitar la rotación de la paleta
        this.player.angle = Phaser.Math.Clamp(this.player.angle, -this.maxRotationAngle, this.maxRotationAngle);

        // Movimiento del jugador: Desplazamiento vertical con arriba/abajo
        const speed = this.playerSpeed * (delta / 1000);
        if (this.cursors.up.isDown) {
            this.player.y -= speed;
        } else if (this.cursors.down.isDown) {
            this.player.y += speed;
        }

        // Actualizar la posición de los círculos de la hitbox para que sigan a la paleta
        const angleRad = Phaser.Math.DegToRad(this.player.angle);
        const cosAngle = Math.cos(angleRad);
        const sinAngle = Math.sin(angleRad);

        for (let i = 0; i < this.hitboxes.length; i++) {
            const hitbox = this.hitboxes[i];
            const offset = this.hitboxOffsets[i];

            // Calcular la posición de la hitbox relativa al centro y rotación de la paleta (a lo largo del eje Y local)
            const newX = this.player.x - offset * sinAngle;
            const newY = this.player.y + offset * cosAngle;
            
            hitbox.setPosition(newX, newY);
        }

        // Sincronizar los cuerpos de física con los game objects
        this.hitboxGroup.children.each(child => {
            if (child.body && child.body.setPosition) {
                child.body.setPosition(child.x - this.hitboxRadius, child.y - this.hitboxRadius);
            }
        });
    }
}