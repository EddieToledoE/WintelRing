export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Configuración del jugador
    this.setOrigin(0.5, 0.5)
    this.setDisplaySize(150, 150)
    this.setCollideWorldBounds(true)
    this.health = 30 // Vida inicial del jugador
    this.lastDirection = 'right'
  }

  update(cursors) {
    this.body.setVelocity(0)

    // Movimiento del jugador
    if (cursors.left.isDown) {
      this.body.setVelocityX(-160)
      this.lastDirection = 'left'
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(160)
      this.lastDirection = 'right'
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-160)
      this.lastDirection = 'up'
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(160)
      this.lastDirection = 'down'
    }
  }

  takeDamage(amount) {
    this.health -= amount
    console.log('Jugador golpeado. Vida restante: ' + this.health)

    // Si la vida del jugador llega a 0 o menos, lo destruyes o reinicias el juego
    if (this.health <= 0) {
      this.die() // Puedes personalizar esta función para manejar la muerte del jugador
    }
  }

  die() {
    console.log('El jugador ha muerto!')
    this.setActive(false) // Desactivar el jugador para detener el update
    this.setVisible(false) // Esconder el sprite del jugador
    this.scene.scene.start('GameOver') // Iniciar la escena de "Game Over"
  }
}
