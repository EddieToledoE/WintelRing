export default class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.scene = scene
    this.setOrigin(0.5, 0.5)
    this.setCollideWorldBounds(true) // Mantener al enemigo dentro de los límites
    this.body.setAllowGravity(false) // Evitar que caiga
    this.body.immovable = true // Hacer que el jefe no se mueva por colisiones
    // Variables del jefe
    this.health = 200
    this.speed = 150
    this.isCharging = false
    this.chargeSpeed = 600
    this.chargeCooldown = 3000
    this.setDisplaySize(250, 250)
    this.shootCooldown = 5000
    this.projectiles = scene.physics.add.group()

    this.startBehavior()
  }

  startBehavior() {
    this.movementEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.updateMovement,
      callbackScope: this,
      loop: true
    })

    this.chargeEvent = this.scene.time.addEvent({
      delay: this.chargeCooldown,
      callback: this.chargeAtPlayer,
      callbackScope: this,
      loop: true
    })

    this.shootEvent = this.scene.time.addEvent({
      delay: this.shootCooldown,
      callback: this.shootInAllDirections,
      callbackScope: this,
      loop: true
    })
  }

  updateMovement() {
    if (this.isCharging || !this.active) return // No moverse si está cargando o si ya está muerto

    const player = this.scene.player
    if (player) {
      this.scene.physics.moveToObject(this, player, this.speed)
    }
  }

  chargeAtPlayer() {
    if (this.isCharging || !this.active) return // No cargar si ya está muerto

    this.isCharging = true
    const player = this.scene.player

    if (player) {
      this.scene.physics.moveToObject(this, player, this.chargeSpeed)

      this.scene.time.delayedCall(1000, () => {
        if (!this.active) return // No continuar si ya está muerto
        this.isCharging = false
        this.body.setVelocity(0)
      })
    }
  }

  shootInAllDirections() {
    if (!this.active) return // No disparar si ya está muerto

    const bulletSpeed = 300
    const angles = [0, 45, 90, 135, 180, 225, 270, 315]

    angles.forEach((angle) => {
      const radianAngle = Phaser.Math.DegToRad(angle)
      const velocityX = Math.cos(radianAngle) * bulletSpeed
      const velocityY = Math.sin(radianAngle) * bulletSpeed

      const bullet = this.projectiles.create(this.x, this.y, 'bullet')
      bullet.setVelocity(velocityX, velocityY)
    })
  }

  takeDamage(amount) {
    this.health -= amount
    console.log(`El jefe recibe ${amount} de daño. Vida restante: ${this.health}`)
    if (this.health <= 0) {
      this.die()
    }
  }

  die() {
    console.log("¡El jefe ha sido derrotado!")

    this.setActive(false)
    this.setVisible(false)
    this.body.setEnable(false)

    // Detener los eventos asociados al jefe
    if (this.movementEvent) this.movementEvent.remove(false)
    if (this.chargeEvent) this.chargeEvent.remove(false)
    if (this.shootEvent) this.shootEvent.remove(false)

    this.destroy()
  }
}
