import { client, Uuid } from '../database/cassandra.js';

export const getRatingsForMovie = async (req, res) => {
    try {
        const { id_filme } = req.params;
        const query = 'SELECT id_filme, usuario, nota, data FROM avaliacoes_por_filme WHERE id_filme = ?';
        
        const result = await client.execute(query, [id_filme], { prepare: true });
        
        res.json(result.rows);

    } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
};

export const addRatingToMovie = async (req, res) => {
    try {
        const { id_filme } = req.params;
        const { usuario, nota } = req.body;

        if (!usuario || nota === undefined) {
            return res.status(400).json({ error: 'Campos "usuario" e "nota" são obrigatórios' });
        }

        const data = new Date();
        const id_avaliacao = Uuid.random();
        const notaInt = parseInt(nota, 10);

        const query = 'INSERT INTO avaliacoes_por_filme (id_filme, data, id_avaliacao, usuario, nota) VALUES (?, ?, ?, ?, ?)';
        
        await client.execute(query, [id_filme, data, id_avaliacao, usuario, notaInt], { prepare: true });

        res.status(201).json({ 
            id_filme, 
            data, 
            id_avaliacao, 
            usuario, 
            nota: notaInt 
        });

    } catch (err) {
        console.error("Erro ao enviar avaliação:", err);
        res.status(500).json({ error: 'Erro ao enviar avaliação' });
    }
};
