import { client, Uuid } from '../database/cassandra.js';

export const getAllMovies = async (req, res) => {
    try {
        const query = 'SELECT id, nome FROM filmes';
        const result = await client.execute(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao buscar filmes:", err);
        res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
};

export const createMovie = async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório' });
        }
        
        const id = Uuid.random();
        const query = 'INSERT INTO filmes (id, nome) VALUES (?, ?)';
        
        await client.execute(query, [id, nome], { prepare: true });
        
        res.status(201).json({ id, nome });

    } catch (err) {
        console.error("Erro ao adicionar filme:", err);
        res.status(500).json({ error: 'Erro ao adicionar filme' });
    }
};
