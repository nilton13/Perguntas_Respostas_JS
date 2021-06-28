const Sequelize = require("sequelize");
const connection = require("./database");

// Criando uma tabela no Banco de Dados com o campo titulo e com o campo descrição.
const Pergunta = connection.define('Perguntas',{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Se não existir no banco de dados a tabela com o nome PERGUNTA será criada.
// Sync sincroniza com o banco de dados.
// Force=  false - serve para se a tabela já existir não cria-la mais.
Pergunta.sync({force: false}).then(() =>{})

module.exports = Pergunta; 