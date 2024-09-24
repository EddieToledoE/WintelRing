import { Game } from './scenes/game';
import GameOver from './scenes/gameOver';
import Menu from './scenes/mainMenu';
import { BossFinalScene } from './scenes/bossFinal';
import { VictoryScene } from './scenes/victory';
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [Menu, Game, GameOver, BossFinalScene, VictoryScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

var game = new Phaser.Game(config);