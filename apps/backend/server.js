const app = require('./app.js')
const { startWSS } = require('./websockets/chat.js')

startWSS()

const port = process.env.PORT ?? 3000

app.listen(port, () => {
    console.log('Server running on port', Number(port))
})
