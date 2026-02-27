const { WebSocketServer } = require('ws')

const startWSS = (port = 8080) => {
  const wss = new WebSocketServer({ port })
  const user_connections = new Map()

  wss.on('connection', ws => {
    ws.on('message', data => {
      const message = JSON.parse(data)

      if (message.type === 'register') {
        user_connections.set(message.user_id, ws)
      } else if (message.type === 'new_message') {
        const recipient_ws = user_connections.get(message.recipient_id)
        if (recipient_ws && recipient_ws.readyState === WebSocket.OPEN) {
          recipient_ws.send(JSON.stringify({
            type: 'message_notification',
            sender_id: message.sender_id
          }))
        }
      }
    })

    ws.on('close', () => {
      user_connections.forEach((connection, user_id) => {
        if (connection === ws) {
          user_connections.delete(user_id)
        }
      })
    })
  })

  console.log(`WebSocket server running on ws://localhost:${port}`)
}

module.exports = {
  startWSS
}
