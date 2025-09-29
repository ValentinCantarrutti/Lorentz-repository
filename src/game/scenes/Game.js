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
        
        // Pasamos 'this' (la escena actual) al constructor de la paleta
        this.paletas = new ClassPaletas(this); 
        
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }

     update(time, delta) {
        // update game objects
        this.paletas.update(time, delta); // la plataforma se mueve
    }
}