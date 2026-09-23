import express, { type Application } from "express";
import { Pool, type PoolConfig } from 'pg';
import crypto from 'crypto';

const app: Application = express();

app.use(express.json());

const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: 5432,
    database: 'urlshortener',
    user: 'postgres',
    password: 'password',
    allowExitOnIdle: true,
    application_name: "urlshortener",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: false
}
const pool: Pool = new Pool(poolConfig);


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    pool.query('SELECT NOW()', (err, res) => {
        release();
        if (err) {
            console.error('Error executing query', err.stack);
            return;
        }
        console.log(res.rows[0]);
    });
});
function generateShortCode(): string {
    return crypto.randomBytes(4).toString('base64').slice(0, 6);
}

app.post('/shorten', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    const shortCode = generateShortCode();
    try {
        await pool.query(
            'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
            [shortCode, url]
        );
        res.json({ shortUrl: `http://${req.headers.host}/${shortCode}` });
    } catch (err) {
        res.status(500).json({ error: 'Database error', err });
    }
});

app.get('/:shortCode', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT original_url FROM urls WHERE short_code = $1',
            [req.params.shortCode]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.redirect(302, result.rows[0].original_url);
    } catch (err) {
        res.status(500).json({ error: 'Database error', err });
    }
});

app.listen(3000, () => console.log('Server on 3000'));