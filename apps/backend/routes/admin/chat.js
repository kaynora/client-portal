const express = require('express')

const chat = require('../../controllers/admin/chat.js')
const session = require('../../middleware/session.js')

const router = express.Router()

router.use(session.check_session('login', 'admin'))

router.get('/get-chat-history', chat.get_chat_history)
router.get('/get-all-chats', chat.get_all_chats)
router.post('/send-message', chat.send_message)

module.exports = router
