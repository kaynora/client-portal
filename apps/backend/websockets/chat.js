const { WebSocketServer } = require('ws')

const startWSS = (port = 8080) => {
  const wss = new WebSocketServer({ port })
  const userConnections = new Map()

  wss.on('connection', ws => {

    ws.on('message', data => {
      const message = JSON.parse(data)
      
      if (message.type === 'register') {
        userConnections.set(message.userId, ws)
      } else if (message.type === 'newMessage') {
        const recipientWs = userConnections.get(message.recipientId)
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({
            type: 'messageNotification',
            senderId: message.senderId
          }))
        }
      }
    })

    ws.on('close', () => {
      userConnections.forEach((connection, userId) => {
        if (connection === ws) {
          userConnections.delete(userId)
        }
      })
    })
  })

  console.log(`WebSocket server running on ws://localhost:${port}`)
}

module.exports = {
  startWSS
}
