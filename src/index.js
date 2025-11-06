import express from 'express';
import path from 'path';
import { initDb } from './database/cassandra.js';
import apiRouter from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, '../public')));

// API Routes - All routes will be prefixed with /api
app.use('/api', apiRouter);

// --- Iniciar o Servidor ---
// Primeiro inicializa o DB, depois inicia o servidor Express
initDb().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Falha ao iniciar o servidor:", err);
});
