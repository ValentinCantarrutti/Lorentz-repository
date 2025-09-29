import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        
        this.add.image(512, 384, 'background');
       
        this.paletas = new ClassPaletas(this); // se crea el rectangulo como clase externa
        
    }

     update() {
    // update game objects
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("R"))) {
      this.scene.restart();
    } //creada la tecla R

    this.paletas.update(); // la plataforma se mueve hacia los lados
    }
}
