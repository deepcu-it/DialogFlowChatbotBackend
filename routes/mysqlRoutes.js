// routes/chatRoutes.js
import express from 'express';
import { getDB } from '../databases/mysqlConnection.js';

const router = express.Router();

// Insert chat
router.post('/insert', async (req, res) => {
    const db = getDB();

    const { session_id, sender, message } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO chat_history (session_id, sender, message, timestamp) VALUES (?, ?, ?, NOW())',
            [session_id, sender, message]
        );
        res.status(201).json({ success: true, insertId: result.insertId });
    } catch (err) {
        console.error('Insert Error:', err);
        res.status(500).json({ error: 'Insert failed' });
    }
});

// Get chat history
router.get('/history/:session_id', async (req, res) => {
    const db = getDB();

    const { session_id } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM chat_history WHERE session_id = ? ORDER BY timestamp ASC',
            [session_id]
        );
        res.json({ chat: rows });
    } catch (err) {
        console.error('Fetch Error:', err);
        res.status(500).json({ error: 'Fetch failed' });
    }
});

export default router;
