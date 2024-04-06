//index.js
import express from "express";
import session from "express-session";
import { db } from "./mongo/dbconfig.js";
import cors from 'cors';
import eventsRouter from "./routers/revents.js";
import locationsRouter from "./routers/rlocations.js";
import userRouter from "./routers/rusers.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })) 
app.use(cors());

 //Configuração do middleware de sessão
app.use(session({
  secret: 'mySecretKey', // Chave secreta para assinar a sessão
  resave: false, // Evita regravar a sessão no armazenamento se nada mudou
  saveUninitialized: false // Evita salvar sessões não inicializadas no armazenamento
}));

// Middleware para lidar com solicitações para /favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// Rota principal
app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Bem vindo ao ExploreBraga!');
});

// Roteamento de eventos
app.use('/events', eventsRouter);
app.use('/locations', locationsRouter);
app.use('/users', userRouter);

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ message: 'Internal server error! index.js' });
});

// Chama a função para conectar ao banco de dados e iniciar o servidor Express
db(app);
