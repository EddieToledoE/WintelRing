import Phaser from "phaser"
import wintel from '../../assets/wintel.png'
import sword from '../../assets/sword.png'
import gun from '../../assets/gun.png'
import bullet from '../../assets/bullet.png'
import zombie from '../../assets/damaged_wintel.png'
import slash from '../../assets/slash.png'
import Player from '../objects/Player'
import Weapon from '../objects/Weapon'
import Enemy from "../objects/Enemy"
import ShootingEnemy from "../objects/ShootingEnemy"
import BattleArena from '../../assets/battleArena.png'
import gunSound from '../../assets/gunSound.mp3'
import swordSound from '../../assets/swordSound.mp3'
import hitsound from '../../assets/damage.mp3'
export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.worker = null // Web Worker que genera enemigos
    this.timeWorker = null // Web Worker de tiempo
    this.enemyWorker = null // Web Worker de enemigos derrotados
    this.enemiesDefeated = 0 // Contador de enemigos derrotados
    this.timeRemaining = 60 // Tiempo restante inicializado en 60 segundos
  }

  preload() {
    // Cargar las imágenes y recursos del juego
    this.load.image('player', wintel)
    this.load.image('sword', sword)
    this.load.image('gun', gun)
    this.load.image('bullet', bullet)
    this.load.image('enemy', zombie)
    this.load.image('slash', slash)
    this.load.image('battleArena', BattleArena)
    this.load.audio('gunshot', gunSound)
    this.load.audio('swordslash', swordSound)
    this.load.audio('hitsound', hitsound)
  }

  create() {
    this.hitSound = this.sound.add('hitsound');
    this.add.image((window.innerWidth / 2), (window.innerHeight / 2), 'battleArena').setDepth(-1)
    // Reiniciar la bandera de fin de juego
    this.isGameOver = false
    this.enemiesDefeated = 0
    this.timeRemaining = 60
    // Establecer los límites del mundo
    this.physics.world.setBounds(0, 0, 1600, 800)

    // Crear el jugador
    this.player = new Player(this, 400, 300)

    // Crear el arma
    this.weapon = new Weapon(this, this.player)

    //Crear textos para indicar los controles 
    this.attackText = this.add.text(10, 60, "Atacar : ESPACIO", { fontSize: '30px', fill: '#ffffff' })
    this.switchWeaponText = this.add.text(10, 80, "Cambiar Arma : Q", { fontSize: '30px', fill: '#ffffff' })
    // Crear los textos de tiempo y enemigos derrotados
    this.survivalTimeText = this.add.text(10, 10, `Tiempo restante: ${this.timeRemaining}s`, { fontSize: '20px', fill: '#ffffff' })
    this.enemiesDefeatedText = this.add.text(10, 40, `Enemigos derrotados: ${this.enemiesDefeated}`, { fontSize: '20px', fill: '#ffffff' })

    // Crear grupos de enemigos
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true // Actualizar automáticamente los enemigos
    })

    this.shootingEnemies = this.physics.add.group({
      classType: ShootingEnemy,
      runChildUpdate: true // Actualizar automáticamente los enemigos que disparan
    })

    // Inicializar los workers de enemigo, contador de tiempo y contador de enemigos
    this.time.delayedCall(500, () => {
      this.initializeEnemySpawner()
      this.initializeEnemyWorker()
      this.initializeTimeWorker()
    })

    // Definir las teclas de entrada
    this.cursors = this.input.keyboard.createCursorKeys()
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.switchWeaponKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)

    // Configurar colisiones con verificaciones para evitar errores
    this.physics.add.overlap(this.weapon.bullets, this.enemies, this.safeBulletHitEnemy, null, this)
    this.physics.add.overlap(this.weapon.bullets, this.shootingEnemies, this.safeBulletHitEnemy, null, this)
    this.physics.add.overlap(this.weapon.swordSlashes, this.enemies, this.safeSlashHitEnemy, null, this)
    this.physics.add.overlap(this.weapon.swordSlashes, this.shootingEnemies, this.safeSlashHitEnemy, null, this)
    this.physics.add.overlap(this.enemies, this.player, this.safeEnemyHitPlayer, null, this)
    this.physics.add.overlap(this.shootingEnemies, this.player, this.safeEnemyHitPlayer, null, this)
  }

  update() {
    if (this.isGameOver) {
      return // No continuar actualizando el juego si el juego ha terminado
    }

    // Actualizar el jugador y el arma
    this.player.update(this.cursors)
    this.weapon.updateWeaponPosition()

    // Actualizar enemigos normales
    this.enemies.children.iterate((enemy) => {
      if (enemy && this.player.x && this.player.y && enemy.active) {
        enemy.update(this.player)
      }
    })

    // Actualizar enemigos que disparan
    this.shootingEnemies.children.iterate((enemy) => {
      if (enemy && this.player.x && this.player.y && enemy.active) {
        enemy.update(this.player)
      }
    })

    // Cambiar de arma
    if (Phaser.Input.Keyboard.JustDown(this.switchWeaponKey)) {
      this.weapon.switchWeapon()
    }

    // Ataque
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.weapon.attack(this.enemies)
    }
  }

  initializeEnemySpawner() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.worker = new Worker('../../utils/Workers/enemySpawnerWorker.js');

    const mapWidth = window.innerWidth
    const mapHeight = window.innerHeight
    const interval = 2000

    this.worker.postMessage({ mapWidth, mapHeight, interval })

    this.worker.onmessage = (e) => {
      if (!this.isGameOver && this.enemies) {
        const { x, y } = e.data
        console.log(`Nuevo enemigo generado en posición (${x}, ${y})`)

        const randomType = Math.random() < 0.5 ? 'enemy' : 'shootingEnemy'

        if (randomType === 'enemy') {
          if (this.enemies.getChildren().length < 50) {
            this.enemies.add(new Enemy(this, x, y))
          }
        } else if (randomType === 'shootingEnemy') {
          if (this.shootingEnemies.getChildren().length < 20) {
            this.shootingEnemies.add(new ShootingEnemy(this, x, y))
          }
        }
      }
    }
  }

  initializeTimeWorker() {
    if (this.timeWorker) {
      this.timeWorker.terminate(); // Asegúrate de terminar el worker si existe
      this.timeWorker = null;
    }
    this.timeWorker = new Worker('../../utils/Workers/timeCounterWorker.js');

    this.timeWorker.postMessage({}) // Iniciar la cuenta regresiva

    this.timeWorker.onmessage = (e) => {
      this.timeRemaining = e.data // Actualizar la variable de tiempo restante
      if (!this.isGameOver && this.survivalTimeText) {
        this.survivalTimeText.setText(`Tiempo restante: ${this.timeRemaining}s`)

        // Si el tiempo llega a 0 y no has derrotado suficientes enemigos, game over
        if (this.timeRemaining <= 0) {
          if (this.enemiesDefeated < 10) {
            this.handleGameOver()
          } else {
            this.moveToBossFinal()
          }
        }
      }
    }
  }


  initializeEnemyWorker() {
    if (this.enemyWorker) {
      this.enemyWorker.terminate(); // Asegúrate de terminar el worker si existe
      this.enemyWorker = null;
    }

    this.enemyWorker = new Worker('../../utils/Workers/enemyCounterWorker.js');

    // Escuchar los mensajes del worker de enemigos derrotados
    this.enemyWorker.onmessage = (e) => {
      this.enemiesDefeated = e.data // Actualizar la variable de enemigos derrotados
      this.enemiesDefeatedText.setText(`Enemigos derrotados: ${this.enemiesDefeated}`)
    }
  }

  // Función segura para colisiones de balas y enemigos
  safeBulletHitEnemy(bullet, enemy) {
    if (bullet && enemy && bullet.active && enemy.active) {
      this.bulletHitEnemy(bullet, enemy)
    }
  }

  // Función cuando una bala impacta con un enemigo
  bulletHitEnemy(bullet, enemy) {
    enemy.takeDamage(5)
    this.hitSound.play(); // Reproducir sonido de impacto
    bullet.destroy()

    if (enemy.health <= 0) {
      this.enemyWorker.postMessage({}) // Actualizar enemigos derrotados
      if (this.enemiesDefeated >= 10) {
        this.moveToBossFinal()
      }
    }
  }

  // Función segura para colisiones de slashes y enemigos
  safeSlashHitEnemy(slash, enemy) {
    if (slash && enemy && slash.active && enemy.active) {
      this.slashHitEnemy(slash, enemy)
    }
  }

  // Función cuando el slash impacta con un enemigo
  slashHitEnemy(slash, enemy) {
    enemy.takeDamage(10)
    this.hitSound.play(); // Reproducir sonido de impacto
    slash.destroy()

    if (enemy.health <= 0) {
      this.enemyWorker.postMessage({}) // Actualizar enemigos derrotados
      if (this.enemiesDefeated >= 10) {
        this.moveToBossFinal()
      }
    }
  }

  // Función segura para colisiones de enemigos con el jugador
  safeEnemyHitPlayer(player, enemy) {
    if (player && enemy && player.active && enemy.active) {
      this.enemyHitPlayer(player, enemy)
    }
  }

  // Función cuando un enemigo impacta con el jugador
  enemyHitPlayer(player, enemy) {
    const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y)

    if (distance < 40) {
      player.takeDamage(10)
      enemy.destroy()

      if (player.health <= 0 && !this.isGameOver) {
        this.isGameOver = true // Evitar múltiples llamadas a handleGameOver
        this.handleGameOver()
      }
    }
  }

  moveToBossFinal() {
    this.isGameOver = true // Marcar que el juego ha terminado

    // Limpiar los workers antes de cambiar de escena
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }

    if (this.timeWorker) {
      this.timeWorker.terminate()
      this.timeWorker = null
    }

    if (this.enemyWorker) {
      this.enemyWorker.terminate()
      this.enemyWorker = null
    }

    // Cambiar a la escena del jefe final
    this.scene.start('bossFinal') // Nombre de la escena del jefe final
  }

  handleGameOver() {
    this.isGameOver = true; // Marcar el juego como terminado

    // Terminar los workers
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    if (this.timeWorker) {
      this.timeWorker.terminate();
      this.timeWorker = null;
    }

    if (this.enemyWorker) {
      this.enemyWorker.terminate();
      this.enemyWorker = null;
    }

    // Destruir los textos
    if (this.survivalTimeText) {
      this.survivalTimeText.destroy();
      this.survivalTimeText = null;
    }

    if (this.enemiesDefeatedText) {
      this.enemiesDefeatedText.destroy();
      this.enemiesDefeatedText = null;
    }

    // Detener la escena
    this.scene.stop();

    // Reiniciar la escena después de asegurarte que todo ha sido limpiado
    this.time.delayedCall(1000, () => {
      this.scene.restart();
    });
  }

}
