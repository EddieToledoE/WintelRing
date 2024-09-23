// enemyCounterWorker.js

let defeatedEnemies = 0

// Escuchar cuando el hilo principal envíe un mensaje para incrementar el conteo
onmessage = function () {
  defeatedEnemies++
  postMessage(defeatedEnemies) // Enviar el conteo actualizado al hilo principal
}
