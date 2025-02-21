//index.js
import express from "express";
import { db } from "./mongo/dbconfig.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import eventsRouter from "./routers/revents.js";
import locationsRouter from "./routers/rlocations.js";
import userRouter from "./routers/rusers.js";
import adminRouter from "./routers/radmin.js";
import initCronjob from "./mongo/OldEvents.js"

const app = express();
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb' , extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Substitua pelo domínio da sua aplicação cliente
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true // Habilita o envio de cookies de autenticação
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
app.use('/admin', adminRouter);

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ message: 'Internal server error! index.js' });
  // Log do cabeçalho CORS na resposta
  //console.log('Cabeçalhos da Resposta:', res.getHeaders());
});

// Chama a função para conectar ao banco de dados e iniciar o servidor Express
db(app);

// Inicializa o cronometro para que todos os dias á meia noite elimina eventos antigos (uma semana passada)
initCronjob();

