import {Game} from './scenes/game';
import GameOver from './scenes/gameOver';
import Menu from './scenes/mainMenu';
import {BossFinalScene} from './scenes/bossFinal';
import {VictoryScene} from './scenes/victory';
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 800,
    scene:[Menu,BossFinalScene,Game, GameOver,VictoryScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    }
}

var game = new Phaser.Game(config);