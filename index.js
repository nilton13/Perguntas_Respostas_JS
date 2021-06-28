const express = require("express");
const app =  express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

// Database

connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) =>{
        console.log(msgErro)
    });

// Setando o ejs como view engine(Renderizador de Html)
app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
// Traduz os dados enviados do formulario para um estrutura JavaScript a ser usada no Backend.
app.use(bodyParser.json());


app.get("/",(req,res) =>{
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC'] // ASC - crescente, DESC -decresente. Ordernar a partir do primeiro campo: ID.
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas    
        });
    }); // SELECT * ALL FROM perguntas 
});

app.get("/perguntar",(req,res) =>{
    res.render("perguntar");
})
// O verbo da rota tem que ser de acordo com o método do formulário que ela vai receber
app.post("/salvarpergunta",(req,res) =>{
    var titulo= req.body.titulo // Recuperando o campo título nomeado no formulário.
    var descricao = req.body.descricao
    // Salvando os dados da recuperados do formulário dentro do Banco de Dados.
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/"); // Após salvar redirecionar para a Página Principal.
    });
});

app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){ // Significa que a pergunta foi achada

            Resposta.findAll({
                where:{perguntaId: pergunta.id}
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta, // Criando uma variável pergunta para receber a pergunta recuperada.
                    respostas : respostas // Criando uma variável respostas para recuperar as respostas referente a mesma pergunta recuperada.
                });
            }) 

        }else{ // Pergunta não encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/"+perguntaId)
    })
});

app.listen(8080,() =>{console.log("App rodando")});