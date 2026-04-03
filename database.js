const { Pool } = require('pg'); // Using PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function processWin(userId, amount, roundId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Transactional safety

        // 1. Update User Balance
        await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);

        // 2. Log Transaction
        await client.query('INSERT INTO transactions (user_id, amount, type, round_id) VALUES ($1, $2, $3, $4)',
            [userId, amount, 'WIN', roundId]);

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}