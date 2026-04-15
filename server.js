const express = require('express');
const {criarBanco} = require('./database');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

//Rota Principal-Raiz

app.get("/", (req, res) => {

    res.send(`
        <body>
            <h1>🏠 Sistema de organização de Abrigos em Situações de Enchentes</h1>
            <h2>Plataforma de agilização de alocação de desabrigados em cenários de desastre</h2>
            <p>Endpoint que leva aos abrigos cadastrados: /abrigos</p>
        </body>    
        
    `);

});

app.get("/abrigos", async (req, res) => {

    const db = await criarBanco();
    const listaAbrigos = await db.all(`SELECT * FROM abrigos`);
    res.json(listaAbrigos);

});

//Rota Específica

app.get("/abrigos/:id", async (req,res) => {
    const {id} = req.params;
    const db = await criarBanco();
    const abrigoEspecifico = await db.all(`
    
        SELECT * FROM abrigos WHERE id = ?`,[id],
    );
    res.json(abrigoEspecifico);
});

//Rota Post - Novos Abrigos

app.post("/abrigos", async (req,res) => {
    const {
        nomeAbrigo,
        enderecoAbrigo,
        capacidadeTotal,
        vagasDisponiveis,
        aceitaPet,
        aceitaDoacoes,
    } = req.body;

    const db = await criarBanco();

    await db.run(
        `INSERT INTO abrigos(nomeAbrigo, enderecoAbrigo, capacidadeTotal, vagasDisponiveis, aceitaPet, aceitaDoacoes) VALUES (?,?,?,?,?,?)`,
        [
            nomeAbrigo,
            enderecoAbrigo,
            capacidadeTotal,
            vagasDisponiveis,
            aceitaPet,
            aceitaDoacoes,
        ],
    );
    res.send(
        `Abrigo novo registrado: ${nomeAbrigo} no endereço: ${enderecoAbrigo}`,
    );

});


//Rota PUT - Atualização

app.put("/abrigos/:id", async (req,res) =>{
    const {id} = req.params;
    const {vagasDisponiveis} = req.body;
    const db = await criarBanco();

    await db.run(
        `
        UPDATE abrigos
        SET vagasDisponiveis = ?
        WHERE id = ?`, [vagasDisponiveis, id],
    );
    res.send(`O abrigo de ${id} foi atualizado com sucesso!`);

});

//Rota DELETE - Rota de remoção

app.delete("/abrigos/:id", async (req, res) => {
    const {id} = req.params;
    const db = await criarBanco();

    await db.run(
        `
            DELETE FROM abrigos WHERE id = ?`, [id],
    );

    res.send(`O abrigo de ${id} foi removido com sucesso!`);
    
});

//Criando uma variável inteligente para a porta.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});