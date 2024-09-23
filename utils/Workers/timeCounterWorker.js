// timeCounterWorker.js

onmessage = function () {
    let timeRemaining = 60 // Inicializar la cuenta regresiva en 60 segundos
  
    const interval = setInterval(() => {
      timeRemaining-- // Reducir el tiempo en 1 cada segundo
  
      // Enviar el tiempo restante de vuelta al juego
      postMessage(timeRemaining)
  
      // Detener el intervalo si el tiempo llega a 0
      if (timeRemaining <= 0) {
        clearInterval(interval)
      }
    }, 1000) // Actualizar cada 1 segundo
  }
  