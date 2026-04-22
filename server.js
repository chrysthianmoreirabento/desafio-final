require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { criarBanco } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializa banco UMA VEZ
let db;

(async () => {
    try {
        db = await criarBanco();
        console.log("✅ Banco conectado com sucesso");
    } catch (error) {
        console.error("❌ Erro ao conectar no banco:", error);
    }
})();

// Rota teste
app.get("/", (req, res) => {
    res.send("🚀 API de Abrigos rodando!");
});

// Listar abrigos
app.get("/abrigos", async (req, res) => {
    try {
        const abrigos = await db.all(SELECT * FROM abrigos);
        res.json(abrigos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar abrigos" });
    }
});

// Criar abrigo
app.post("/abrigos", async (req, res) => {
    try {
        const {
            nomeAbrigo,
            enderecoAbrigo,
            capacidadeTotal,
            vagasDisponiveis,
            aceitaPet,
            aceitaDoacoes
        } = req.body;

        if (!nomeAbrigo || !enderecoAbrigo) {
            return res.status(400).json({ erro: "Dados obrigatórios faltando" });
        }

        const result = await db.run(
            `INSERT INTO abrigos 
            (nomeAbrigo, enderecoAbrigo, capacidadeTotal, vagasDisponiveis, aceitaPet, aceitaDoacoes)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nomeAbrigo,
                enderecoAbrigo,
                capacidadeTotal,
                vagasDisponiveis,
                aceitaPet,
                aceitaDoacoes
            ]
        );

        res.status(201).json({ id: result.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao criar abrigo" });
    }
});

// Deletar abrigo
app.delete("/abrigos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.run(DELETE FROM abrigos WHERE id = ?, [id]);

        res.json({ mensagem: "Abrigo removido com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao deletar abrigo" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(🔥 Servidor rodando na porta ${PORT});
});
