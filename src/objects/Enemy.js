export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy') // Usar la imagen de 'enemy'
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.health = 30 // Vida del enemigo
    this.setCollideWorldBounds(true) // Mantener al enemigo dentro de los límites
    this.body.setAllowGravity(false) // Evitar que caiga
    this.speed = 50 // Velocidad del enemigo


    this.setDisplaySize(150, 150) // Tamaño del enemigo
    this.body.setSize(100, 100) // Ajustar el hitbox del enemigo
    // Log para verificar posición
    console.log(`Enemigo creado en posición (${x}, ${y})`)
  }

  update(player) {
    if (player.x && player.y) {
      // Mover el enemigo hacia el jugador solo si el jugador tiene coordenadas válidas
      this.scene.physics.moveToObject(this, player, this.speed)

      // Verificar si el enemigo está lo suficientemente cerca del jugador para detenerse
      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y)
      if (distance < 20) {
        this.setVelocity(0) // Detener el enemigo si está muy cerca del jugador
      }

      // Log para ver la posición actual del enemigo durante el movimiento
      //console.log(`Enemigo en posición (${this.x}, ${this.y})`)
    } else {
      //console.log('Error: El jugador no tiene coordenadas válidas.')
    }
  }

  takeDamage(amount) {
    this.health -= amount
    console.log(`Enemigo golpeado. Vida restante: ${this.health}`)
    
    if (this.health <= 0) {
      console.log("Enemigo destruido")
      this.destroy() // Destruir el enemigo si su vida llega a 0
    }
  }
}
