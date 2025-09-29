import { Scene, Input } from 'phaser';
import ClassPaletas from '../Objects/ClassPaletas.js';

export class Game extends Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('background', 'bg.png');
        // this.load.image('logo', 'logo.png'); // logo no se usa
    }

    create ()
    {
        const centroX = this.cameras.main.width / 2;
        const centroY = this.cameras.main.height / 2;
        this.add.image(centroX, centroY, "background").setOrigin(0.5).setDepth(0).setScale(2);
        
        // Crear jugador 1 (controlado con flechas) con brillo azul
        this.player1 = new ClassPaletas(this, 200, 300, 170, 35, 0x0000ff, 'player1'); 
        
        // Crear jugador 2 (controlado con WASD) con brillo rojo
        this.player2 = new ClassPaletas(this, 824, 300, 170, 35, 0xff0000, 'player2');

        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }

     update(time, delta) {
        // Actualizar ambos jugadores
        this.player1.update(time, delta);
        this.player2.update(time, delta);
    }
}