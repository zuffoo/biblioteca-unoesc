import express from 'express';
import dotenv from 'dotenv';
import banco from './src/banco.js';
import cors from 'cors';
import FuncionarioController from './controller/FuncionarioController.js'; 
dotenv.config();

const app = express();
app.use(express.json());

app.get('/funcionarios', FuncionarioController.listar);
app.get('/funcionarios/:id', FuncionarioController.selecionar);
app.post('/funcionarios', FuncionarioController.inserir);
app.put('/funcionarios/:id', FuncionarioController.alterar);
app.put('/funcionarios/demitir/:id', FuncionarioController.demitir);
app.put('/funcionarios/senha/:id', FuncionarioController.definirSenha);

app.use(cors());

banco.authenticate()
  .then(() => console.log("Banco conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar no banco:", err));

app.get("/", (req, res) => {
  res.json({ mensagem: "API rodando!" });
});

app.listen(4000, () => {
  console.log("Servidor rodando em http://localhost:4000");
});
