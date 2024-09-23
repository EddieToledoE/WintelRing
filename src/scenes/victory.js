import Phaser from "phaser"

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' })
  }

  create() {
    // Mostrar el mensaje de victoria
    this.add.text(400, 300, '¡Has derrotado al jefe! ¡Victoria!', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5, 0.5)

    // Opción para reiniciar el juego o regresar al menú principal
    this.add.text(400, 400, 'Presiona R para reiniciar', {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5, 0.5)

    // Definir la tecla para reiniciar
    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('MainMenu') // Reiniciar el juego desde la escena principal
    })
  }
}
