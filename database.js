const sqlite3 = require('sqlite3');
const {open} = require('sqlite');


const criarBanco = async () => {
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database,
    });

    //Criar tabela Abrigos

    await db.exec(`
            CREATE TABLE IF NOT EXISTS abrigos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nomeAbrigo TEXT,
                enderecoAbrigo TEXT,
                capacidadeTotal INTEGER,
                vagasDisponiveis INTEGER,
                aceitaPet TEXT,
                aceitaDoacoes TEXT
            )
    `);

     console.log("Tabela criada com sucesso!");


  //Insert - C do CRUD - CREATE
  

    const listagemAbrigos = await db.get(`SELECT COUNT (*) AS total FROM abrigos`);

    if(listagemAbrigos.total === 0){
            await db.exec(`
                INSERT INTO abrigos 
                (nomeAbrigo,enderecoAbrigo, capacidadeTotal,vagasDisponiveis, aceitaPet, aceitaDoacoes)
                VALUES 
                ("Escola Tobias Barreto", "Rua das bananeiras, 033 - Centro", 50, 10, 1, "alimentos, água"),
                ("paroquia São João Batista", "Av. Brasil, 146 - Vila Nova", 70, 15, 0, "colchões, produtos de higiene"),
                ("ONG Mãos Solidárias", "Rua da fé, 109 - Jardim União", 20, 30, 1, "alimentos, água, produtos de higiene"),
                ("Escola Estadual julia lopez", "Rua conego afonso, 397 - Parque Verde", 32, 42, 0, "colchões, água"),
                ("Igreja Comunidaria", "Av. Central, 091 - Bairro Alto", 20, 4, 1, "alimentos, produtos de higiene"),
                ("Igreja São bento", "Av. Esmeralda, 754- Vila Piauí", 20, 9, 1, "colchões, produtos de higiene")
            `);
    } else {
        console.log(`Banco pronto com ${listagemAbrigos.total} de abrigos.`);
    };

    
  //Select - R do CRUD - READ
 

    const  geralAbrigos = await db.all("SELECT * FROM abrigos");
    console.table( geralAbrigos);

    //Selecionar Abrigo Específico
    const abrigoEspecifico = await db.all(`
    
        SELECT * FROM abrigos WHERE nomeAbrigo = "Igreja São João Batista"
    `);

    console.table(abrigoEspecifico);

  
  //Update - U do CRUD - Update
  

    await db. run(`
     UPDATE abrigos
     SET vagasDisponiveis = 11
     WHERE id = 4
    `);

    console.log("As vagas disponiveis foram atualizadas!");


  
  //Delete - D do CRUD - Delete
  


    await db.run(`DELETE FROM abrigos WHERE id = 2`)
    console.log("Registro do Abrigo 2 removido!")

 
  //Relatório atualizado/SELECT FINAL
  

    const abrigoListagemFinal = await db.all(`SELECT * FROM abrigos`);
    console.table(abrigoListagemFinal);


        return db;


};

module.exports = {criarBanco};