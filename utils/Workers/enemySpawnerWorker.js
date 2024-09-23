

// Función para generar posiciones aleatorias dentro de los límites del mapa
function generateEnemyPosition(mapWidth, mapHeight) {
  const x = Math.floor(Math.random() * mapWidth)
  const y = Math.floor(Math.random() * mapHeight)
  return { x, y }
}

// Escuchar mensajes desde el hilo principal
onmessage = function (e) {
  const { mapWidth, mapHeight, interval } = e.data



  if (!mapWidth || !mapHeight || !interval) {
    console.error("Parámetros incorrectos recibidos por el Web Worker")
    return
  }

  // Generar enemigos en intervalos regulares
  setInterval(() => {
    const position = generateEnemyPosition(mapWidth, mapHeight)

    postMessage(position) // Enviar la posición de un nuevo enemigo al hilo principal
  }, interval)
}
