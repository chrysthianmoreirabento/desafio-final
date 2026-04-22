const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

const criarBanco = async () => {
    if (db) return db; // evita múltiplas conexões

    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS abrigos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nomeAbrigo TEXT NOT NULL,
            enderecoAbrigo TEXT NOT NULL,
            capacidadeTotal INTEGER,
            vagasDisponiveis INTEGER,
            aceitaPet INTEGER,
            aceitaDoacoes TEXT
        )
    `);

    const { total } = await db.get(SELECT COUNT(*) as total FROM abrigos);

    if (total === 0) {
        await db.run(`
            INSERT INTO abrigos 
            (nomeAbrigo, enderecoAbrigo, capacidadeTotal, vagasDisponiveis, aceitaPet, aceitaDoacoes)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            "Escola Tobias Barreto",
            "Rua das bananeiras, 033 - Centro",
            50,
            10,
            1,
            "alimentos, água"
        ]);
    }

    return db;
};

module.exports = { criarBanco };
