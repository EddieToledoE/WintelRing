import Phaser from "phaser"
import BossFinal from '../objects/Boss'
import BossImagen from '../../assets/Boss.png'
import Bullet from '../../assets/bullet.png'
import Player from '../objects/Player'
import Weapon from '../objects/Weapon'
import BattleArena from '../../assets/battleArena.png'
import gunSound from '../../assets/gunSound.mp3'
import swordSound from '../../assets/swordSound.mp3'
import hitsound from '../../assets/damage.mp3'
export class BossFinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'bossFinal' }) // Nombre de la escena
  }

  preload() {
    // Cargar la imagen del jefe y las balas
    this.load.image('boss', BossImagen)
    this.load.image('bullet', Bullet)
    this.load.image('battleArena', BattleArena)
    this.load.audio('gunshot', gunSound)
    this.load.audio('swordslash', swordSound)
    this.load.audio('hitsound', hitsound)
  }

  create() {
    this.hitSound = this.sound.add('hitsound');
    this.add.image((window.innerWidth / 2), (window.innerHeight / 2), 'battleArena').setDepth(-1)
    // Crear el jugador
    this.player = new Player(this, 400, 300) // Posición inicial del jugador
    this.weapon = new Weapon(this, this.player) // Usar la clase de armas

    // Crear al jefe final
    this.boss = new BossFinal(this, 800, 400) // Posición inicial del jefe

    // Configurar las teclas de ataque y cambio de arma
    this.cursors = this.input.keyboard.createCursorKeys()
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.switchWeaponKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)

    // Configurar colisiones entre las balas y el jefe
    this.physics.add.collider(this.weapon.bullets, this.boss, this.playerBulletHitBoss, null, this)
    this.physics.add.collider(this.weapon.swordSlashes, this.boss, this.playerSlashHitBoss, null, this)

    // Configurar colisiones entre las balas del jefe y el jugador
    this.physics.add.collider(this.boss.projectiles, this.player, this.bossBulletHitPlayer, null, this)
  }

  update() {
    // Movimiento del jugador
    this.player.update(this.cursors)
    this.weapon.updateWeaponPosition()

    // Cambiar de arma
    if (Phaser.Input.Keyboard.JustDown(this.switchWeaponKey)) {
      this.weapon.switchWeapon()
    }

    // Ataque
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.weapon.attack() // Ya que el ataque afecta a enemigos en su rango
    }
  }

  bossBulletHitPlayer(player, bullet) {
    player.takeDamage(5) // El jugador recibe daño
    bullet.destroy() // Destruir la bala del jefe
  }

  // Función cuando una bala del jugador impacta al jefe
  playerBulletHitBoss(boss, bullet) {
    // Verificar si el objeto es una instancia de BossFinal antes de aplicar daño
    if (boss instanceof BossFinal) {
      this.hitSound.play();
      boss.takeDamage(10) // El jefe recibe daño
      bullet.destroy() // Destruir la bala del jugador
      this.checkBossDefeated() // Verificar si el jefe ha sido derrotado
    }
  }

  // Función cuando el jugador golpea al jefe con la espada
  playerSlashHitBoss(boss, slash) {
    // Verificar si el objeto es una instancia de BossFinal antes de aplicar daño
    if (boss instanceof BossFinal) {
      this.hitSound.play();
      boss.takeDamage(15) // El jefe recibe más daño con la espada
      slash.destroy() // Destruir el slash (tajada) de la espada
      this.checkBossDefeated() // Verificar si el jefe ha sido derrotado
    }
  }

  checkBossDefeated() {
    if (this.boss.health <= 0) {
      console.log('El jefe ha sido derrotado. Cambiando a escena de victoria...')
      this.time.delayedCall(1000, () => {
        this.scene.start('VictoryScene') // Cambiar a la escena de victoria
      })
    }
  }
}
