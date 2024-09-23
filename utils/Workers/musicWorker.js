self.addEventListener('message', function(e) {
    if (e.data === 'start') {
      postMessage({ action: 'play' }) // Enviar un mensaje al hilo principal para reproducir música
    } else if (e.data === 'stop') {
      postMessage({ action: 'stop' }) // Enviar un mensaje al hilo principal para detener la música
    }
  })
  