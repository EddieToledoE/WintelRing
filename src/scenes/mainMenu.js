import Logo from '../../assets/wintelRing.png'
import MenuTheme from '../../assets/Menu.mp3'
export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' })
    this.musicWorker = new Worker('../../utils/Workers/musicWorker.js')
  }

  preload() {
    this.load.image('logo', Logo)
    this.load.audio('backgroundMusic', MenuTheme)
  }

  create() {


    this.musicWorker.onmessage = (e) => {
      if (e.data.action === 'play') {
        if (!this.music) {
          this.music = this.sound.add('backgroundMusic', {
            loop: true,
            volume: 0.5
          })
          this.music.play()
        }
      } else if (e.data.action === 'stop') {
        if (this.music) {
          this.music.stop()
        }
      }
    }

    // Iniciar la música cuando se cargue la escena
    this.musicWorker.postMessage('start') // Enviar mensaje al worker para iniciar la música


    this.cameras.main.setBackgroundColor('#442f30')

    // Imagen del logo centrada
    const logo = this.add.image((window.innerWidth / 2), (window.innerHeight / 2), 'logo') // 800 y 400 centran la imagen en 1600x800
    logo.setScale(0.75) // Escala ajustada para que no sea tan grande

    // Opción para iniciar el juego
    this.add.text((window.innerWidth / 2), (window.innerHeight / 2), 'Press ENTER to Start', { fontSize: '44px', fill: '#fff' }).setOrigin(0.5)



    // Iniciar el juego al presionar ENTER
    this.input.keyboard.once('keydown-ENTER', () => {
      this.musicWorker.postMessage('stop') // Detener la música antes de iniciar el juego
      this.scene.start('Game') // Iniciar la escena del juego
    })


  }

  shutdown() {
    this.musicWorker.postMessage('stop') // Asegurarse de detener la música al salir del menú
  }

}
