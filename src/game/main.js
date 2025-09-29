import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    dom: {
        createContainer: true // Permite a Phaser crear un contenedor DOM para elementos HTML
    },

    type: AUTO,
    width: 1980,
    height: 1260,

    parent: 'game-container',

    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },

    scene: MainGame
};

export default new Game(config);