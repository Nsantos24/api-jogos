const express = require("express")
const mysql= require("mysql2/promise")
const app = express()


app.use(express.json())

const pool =mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"jogos",
    waitForConnections:true
})

app.get("/jogos", async (req, res) =>{
    const [jogos]= await pool.execute("SELECT * FROM game")
    return res.json(jogos)
})

app.post("/jogos", async (req, res) =>{
    const{nome, desenvolvedora, sinopse, genero_id} = req.body

    if(!nome || !desenvolvedora || !sinopse || !genero_id){
        return res.status(400).json({error:"Nome, desenvolvedora, sinopse, genero_id são obrigatórios"})
    }

    if(nome.length < 3){
        return res.status(400).json({error:"Nome precisa ter mais de 3 caracteres"})
    }
    const[resultado]= await pool.execute
    ("INSERT INTO game(nome, desenvolvedora, sinopse, genero_id) VALUES(?, ?, ?, ?)",
        [nome, desenvolvedora, sinopse, genero_id ])
        return res.status(201).json({id:resultado.insertId, nome, desenvolvedora, sinopse, genero_id})
})
app.put("/jogos/:id", async (req, res) => {
    const {nome, desenvolvedora, sinopse, genero_id} = req.body

    if(! nome || !desenvolvedora || !sinopse || !genero_id){
         return res.status(400).json({error:"Nome, desenvolvedora, sinopse, genero_id são obrigatórios"})
    }
    const id = req.params.id

    const [resultado] = await pool.execute(
        "UPDATE game SET nome = ?, desenvolvedora = ?, sinopse = ?, genero_id = ? WHERE id = ?",
        [nome, desenvolvedora, sinopse, genero_id, id]
    )
    
    if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Jogo  não encontrado"})
    }

    return res.json({ id, nome, desenvolvedora, sinopse, genero_id })
})
 app.delete("/jogos/:id", async (req,res) => {
    const id= req.params.id
    const[resultado]= await pool.execute("DELETE FROM game WHERE id =?",
        [id]
    )
    if(resultado.affectedRows === 0){
        return res.status(404).json({error:"Jogos não encontrados"})
    }
    return res.status(204).end()
 })
  const jogos =[
    {id:1, nome:"Minecraft"},
    {id:2, nome:"Roblox"}
  ]

 app.get("/jogos/:id", (req, res) => {
    const idInformado = req.params.id

    const jogo = jogos.find(
        li => li.id === Number(idInformado)
    )

    if (!jogo) {
        return res.status(404).json({
            error: "Jogo não encontrado"
        })
    }

    res.json(jogo)
})
  app.get("/genero", async (req, res) => {
  const [generos] = await pool.execute("SELECT * FROM genero")
  return res.json(generos)
})

 app.post("/genero", async (req,res) =>{
    const{nome, descricao}= req.body

    if(!nome || !descricao){
        return res.status(400).json({erro:"nome e descricao obrigatorios"})
    }
    
    if(nome.length < 3){
        return res.status(400).json({error: "Nome precisa ter mais de 3 caracteres"})
    }
    const [resultado] = await  pool.execute
    (" INSERT INTO genero(nome, descricao) VALUES(?, ?)",
    [nome, descricao ])
    return res.status(201).json({id: resultado.insertId, nome , descricao
    })
 })

app.listen(3000, () => console.log("API no ar"))