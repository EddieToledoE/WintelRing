export default class Weapon extends Phaser.GameObjects.Sprite {
  constructor(scene, player, type = 'sword') {
    super(scene, player.x, player.y, type)
    scene.add.existing(this)

    this.player = player
    this.currentWeapon = type
    this.setOrigin(0.5, 0.5)
    this.updateWeaponSize()

     // Cargar sonidos de ataque
     this.swordSound = scene.sound.add('swordslash') // Cargar sonido de espada
     this.gunSound = scene.sound.add('gunshot') // Cargar sonido de disparo
    // Crear el grupo de balas
    this.bullets = scene.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10
    })

    // Crear el grupo de "tajadas" de la espada
    this.swordSlashes = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10
    })

    this.isSwitchingWeapon = false // Cooldown para cambio de armas
  }

  switchWeapon() {
    if (this.isSwitchingWeapon) return // Si está cambiando de arma, ignorar nuevas entradas

    this.isSwitchingWeapon = true // Iniciar el cooldown
    this.scene.time.delayedCall(300, () => {
      this.isSwitchingWeapon = false // Permitir el cambio de arma después del cooldown
    })

    if (this.currentWeapon === 'sword') {
      this.currentWeapon = 'gun'
      this.setTexture('gun')
    } else {
      this.currentWeapon = 'sword'
      this.setTexture('sword')
      this.updateWeaponSize()
    }
  }

  updateWeaponPosition() {
    if (this.player.lastDirection === 'right') {
      this.x = this.player.x + 40
      this.y = this.player.y
      this.setAngle(180) // Apuntar hacia la derecha
    } else if (this.player.lastDirection === 'left') {
      this.x = this.player.x - 40
      this.y = this.player.y
      this.setAngle(0) // Apuntar hacia la izquierda
    } else if (this.player.lastDirection === 'up') {
      this.x = this.player.x
      this.y = this.player.y - 40
      this.setAngle(90) // Apuntar hacia arriba
    } else if (this.player.lastDirection === 'down') {
      this.x = this.player.x
      this.y = this.player.y + 40
      this.setAngle(-90) // Apuntar hacia abajo
    }
  }

  attack(enemies) {
    if (this.currentWeapon === 'sword') {
      // Crear una "tajada" al atacar con textura
      this.swordSound.play() // Reproducir sonido de espada
      let slash = this.swordSlashes.get(this.player.x, this.player.y, 'slash') // Usar textura 'slash'

      if (slash) {
        slash.setActive(true)
        slash.setVisible(true)
        slash.setDisplaySize(100, 50) // Ajustar el tamaño del slash y su hitbox

        // Ajustar el tamaño del hitbox de colisión del slash
        this.scene.physics.add.existing(slash)
        slash.body.setSize(400, 250) // Ajustar el hitbox del slash

        // Posicionar la tajada y rotarla según la dirección del jugador
        if (this.player.lastDirection === 'right') {
          slash.setPosition(this.player.x + 140, this.player.y) // Más alejado hacia la derecha
          slash.setAngle(0) // Sin rotación adicional
        } else if (this.player.lastDirection === 'left') {
          slash.setPosition(this.player.x - 140, this.player.y) // Más alejado hacia la izquierda
          slash.setAngle(180) // Rotar 180 grados
        } else if (this.player.lastDirection === 'up') {
          slash.setPosition(this.player.x, this.player.y - 140) // Más alejado hacia arriba
          slash.setAngle(-90) // Rotar -90 grados
        } else if (this.player.lastDirection === 'down') {
          slash.setPosition(this.player.x, this.player.y + 140) // Más alejado hacia abajo
          slash.setAngle(90) // Rotar 90 grados
        }

        // Mostrar el slash durante un tiempo fijo (200 ms), independientemente de si hay colisión
        this.scene.time.delayedCall(200, () => {
          slash.destroy() // Destruir el slash después de mostrarlo
        })

        // Detectar colisiones entre la tajada y los enemigos (sin verificación de distancia)
        this.scene.physics.overlap(slash, enemies, (slash, enemy) => {
          // Simplemente aplica daño al enemigo al colisionar
          enemy.takeDamage(10) // El enemigo recibe daño
        })
      }
    } else if (this.currentWeapon === 'gun') {
      this.gunSound.play() // Reproducir sonido de disparo
      let bullet = this.bullets.get(this.player.x, this.player.y)
      if (bullet) {
        bullet.setActive(true)
        bullet.setVisible(true)
        bullet.setDisplaySize(20, 20)

        // Dirección de las balas según la dirección del jugador
        if (this.player.lastDirection === 'right') {
          bullet.setVelocityX(300)
        } else if (this.player.lastDirection === 'left') {
          bullet.setVelocityX(-300)
        } else if (this.player.lastDirection === 'up') {
          bullet.setVelocityY(-300)
        } else if (this.player.lastDirection === 'down') {
          bullet.setVelocityY(300)
        }

        // Destruir la bala después de 2 segundos
        this.scene.time.delayedCall(2000, () => {
          bullet.destroy()
        })
      }
    }
  }

  updateWeaponSize() {
    if (this.currentWeapon === 'sword') {
      this.setDisplaySize(150, 150) // Ajustar tamaño del sprite de la espada
    } else if (this.currentWeapon === 'gun') {
      this.setDisplaySize(50, 50) // Ajustar tamaño del sprite de la pistola
    }
  }
}
