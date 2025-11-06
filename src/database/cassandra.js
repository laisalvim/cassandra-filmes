import cassandra from 'cassandra-driver';

const CASSANDRA_HOST = process.env.CASSANDRA_HOST || '127.0.0.1';
const CASSANDRA_DATACENTER = process.env.CASSANDRA_DATACENTER || 'datacenter1';
const KEYSPACE = 'movie_reviews';

const client = new cassandra.Client({
    contactPoints: [CASSANDRA_HOST],
    localDataCenter: CASSANDRA_DATACENTER,
});

const Uuid = cassandra.types.Uuid;

async function initDb() {
    try {
        console.log("Conectando ao Cassandra...");
        await client.connect();
        console.log(`Conectado a ${client.hosts.length} hosts do cluster.`);

        console.log("Criando Keyspace (se não existir)...");
        await client.execute(`
            CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE}
            WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
        `);

        client.keyspace = KEYSPACE;

        console.log("Criando tabela 'filmes' (se não existir)...");
        await client.execute(`
            CREATE TABLE IF NOT EXISTS filmes (
                id uuid PRIMARY KEY,
                nome text
            )
        `);

        console.log("Criando tabela 'avaliacoes_por_filme' (se não existir)...");
        await client.execute(`
            CREATE TABLE IF NOT EXISTS avaliacoes_por_filme (
                id_filme uuid,
                data timestamp,
                id_avaliacao uuid,
                usuario text,
                nota int,
                PRIMARY KEY (id_filme, data, id_avaliacao)
            ) WITH CLUSTERING ORDER BY (data DESC)
        `);

        console.log("Banco de dados pronto!");

    } catch (err) {
        console.error("ERRO AO INICIALIZAR O BANCO:", err);
        process.exit(1);
    }
}

export { client, initDb, Uuid };
