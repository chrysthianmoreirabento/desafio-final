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
                nome_abrigo TEXT,
                endereco_abrigo TEXT,
                capacidade_total INTEGER,
                vagas_disponiveis INTEGER,
                aceita_pet TEXT,
                aceita_doacoes TEXT
            )
    `);

     console.log("Tabela criada com sucesso!");

  //**************************
  //Insert - C do CRUD - CREATE
  //**************************

    const listaAbrigos = await db.get(`SELECT COUNT (*) AS total FROM abrigos`);

    if(listaAbrigos.total === 0){
            await db.exec(`
                INSERT INTO abrigos 
                (nome_abrigo,endereco_abrigo, capacidade_total,vagas_disponiveis, aceita_pet, aceita_doacoes)
                VALUES 
                ("Escola Municipal Esperança", "Rua das Flores, 123 - Centro", 35, 0, 1, "alimentos, água"),
                ("Igreja São João Batista", "Av. Brasil, 456 - Vila Nova", 20, 5, 0, "colchões, produtos de higiene"),
                ("ONG Mãos Solidárias", "Rua da Paz, 789 - Jardim União", 15, 3, 1, "alimentos, água, produtos de higiene"),
                ("Escola Estadual Nova Vida", "Rua Horizonte, 321 - Parque Verde", 35, 12, 0, "colchões, água"),
                ("Igreja Comunidade da Fé", "Av. Central, 654 - Bairro Alto", 20, 7, 1, "alimentos, produtos de higiene"),
                ("Igreja São Pedro", "Av. Esmeralda, 45 - Vila Piauí", 20, 9, 1, "colchões, produtos de higiene")
            `);
    } else {
        console.log(`Banco pronto com ${listaAbrigos.total} de abrigos.`);
    }
  
  //**************************
  //Select - R do CRUD - READ
  //**************************

    const todosAbrigos = await db.all("SELECT * FROM abrigos");
    console.table(todosAbrigos);

    //Selecionar Abrigo Específico
    const abrigoEspecifico = await db.all(`
    
        SELECT * FROM abrigos WHERE nome_abrigo = "Igreja São João Batista"
    `);

    console.table(abrigoEspecifico);

  //**************************
  //Update - U do CRUD - Update
  //**************************

    await db. run(`
     UPDATE abrigos
     SET vagas_disponiveis = 11
     WHERE id = 4
    `);

    console.log("As vagas disponiveis foram atualizadas!");


  //**************************
  //Delete - D do CRUD - Delete
  //**************************


    await db.run(`DELETE FROM abrigos WHERE id = 2`)
    console.log("Registro do Abrigo 2 removido!")

  //**************************
  //Relatório atualizado/SELECT FINAL
  //**************************

    const abrigoListaFinal = await db.all(`SELECT * FROM abrigos`);
    console.table(abrigoListaFinal);


        return db;


};

module.exports = {criarBanco};