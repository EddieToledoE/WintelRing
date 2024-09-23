export default class GameOver extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOver' })
    }
  
    create() {
      // Mostrar un texto de "Game Over"
      this.add.text(400, 200, 'GAME OVER', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5)
  
      // Botón para volver a intentar el juego
      this.add.text(400, 300, 'Press R to Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5)
      
      // Botón para salir del juego (puedes personalizarlo para ir a un menú principal)
      this.add.text(400, 350, 'Press Q to Quit', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5)
  
      // Definir las teclas
      this.input.keyboard.once('keydown-R', () => {
        this.scene.start('Game') // Reiniciar la escena del juego
      })
  
      this.input.keyboard.once('keydown-Q', () => {
        this.scene.stop('Game') // Detener la escena del juego actual
        this.scene.start('MainMenu') // Enviar a un menú principal (puedes crear esta escena)
      })
    }
  }
  