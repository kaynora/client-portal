const { db } = require('../../stores/postgres.js')

const get_chat_history = async (req, res) => {
  const admin_id = req.admin_id
  const client_id = req.query.client_id

  try {
    const query_result = await db.any(`
      SELECT message_content, sender_type, created_at
      FROM messages
      WHERE (
        (sender_id = $1 AND recipient_id = $2)
        OR
        (sender_id = $2 AND recipient_id = $1)
      )
      LIMIT 50
    `, [admin_id, client_id])

    res.status(200).send(query_result)
  } catch (err) {
    console.log(err)
    res.status(401).send('Failed to retrieve chat history')
  }
}

const get_all_chats = async (req, res) => {
  const admin_id = req.admin_id

  try {
    const query_result = await db.any(`
      SELECT DISTINCT ON (c.id)
        c.full_name,
        c.id,
        m.message_content,
        m.created_at
      FROM clients c
      LEFT JOIN messages m
        ON (
          (m.recipient_id = c.id AND m.sender_id = $1)
          OR
          (m.sender_id = c.id AND m.recipient_id = $1)
        )
      WHERE c.admin_id = $1
      ORDER BY c.id, m.created_at DESC
    `, [admin_id])

    res.status(200).send(query_result)
  } catch (err) {
    console.log(err)
    res.status(401).send('Failed to retrieve chat history')
  }
}

const send_message = async (req, res) => {
  const admin_id = req.admin_id
  const client_id = req.query.client_id
  const message = req.body.message

  try {
    const query_result = await db.none(`
      INSERT INTO messages (sender_id, sender_type, recipient_id, message_content)
      VALUES ($1, 'admin', $2, $3)
    `, [admin_id, client_id, message])

    res.status(200).send('Message sent')
  } catch (err) {
    console.log(err)
    res.status(401).send('Failed to send message')
  }
}

module.exports = {
  get_chat_history,
  get_all_chats,
  send_message,
}
