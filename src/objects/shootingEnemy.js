import Enemy from './Enemy'

export default class ShootingEnemy extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y) // Usar el constructor del enemigo básico

    // Crear un grupo de balas para los disparos del enemigo
    this.bullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
    })

    // Establecer un temporizador para disparar cada 2 segundos
    this.shootTimer = scene.time.addEvent({
      delay: 2000, // 2 segundos
      callback: this.shoot,
      callbackScope: this,
      loop: true, // Repetir indefinidamente
    })

    this.bulletSpeed = 200 // Velocidad de las balas
  }

  // Método para que el enemigo dispare hacia el jugador
  shoot() {
    if (this.scene.player && this.active) {
      const bullet = this.bullets.get(this.x, this.y, 'bullet') // Obtener una bala del grupo
      if (bullet) {
        bullet.setActive(true)
        bullet.setVisible(true)
        bullet.setDisplaySize(20, 20) // Tamaño de la bala

        // Apuntar la bala hacia la posición actual del jugador
        this.scene.physics.moveToObject(bullet, this.scene.player, this.bulletSpeed)

        // Destruir la bala después de 3 segundos para evitar sobrecarga
        this.scene.time.delayedCall(3000, () => {
          bullet.destroy()
        })
      }
    }
  }

  update(player) {
    // Llamar al método de actualización del enemigo básico
    super.update(player)
    
    // Mover las balas y detectar colisiones con el jugador
    this.bullets.children.each((bullet) => {
      if (bullet.active && Phaser.Math.Distance.Between(bullet.x, bullet.y, player.x, player.y) < 20) {
        bullet.destroy() // Destruir la bala si golpea al jugador
        player.takeDamage(10) // El jugador recibe daño
      }
    }, this)
  }

  // Si el enemigo es destruido, también destruye el temporizador
  destroy() {
    this.shootTimer.remove() // Eliminar el temporizador de disparo
    super.destroy() // Llamar al método destroy del enemigo base
  }
}
