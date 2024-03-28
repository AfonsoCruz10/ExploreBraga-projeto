//index.js
import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';
import eventsRouter from "./routers/revents.js";
import locationsRouter from "./routers/rlocations.js";
import userRouter from "./routers/rusers.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })) 
app.use(cors());

// Middleware para lidar com solicitações para /favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

// Rota principal
app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Bem vindo ao Projeto teste!!');
});

// Roteamento de eventos
app.use('/events', eventsRouter);
app.use('/locations', locationsRouter);
app.use('/users', userRouter);

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
  console.error("Erro:", error);
  res.status(500).json({ message: "Erro interno do servidor" });
});

// Conexão com o banco de dados e inicialização do servidor
mongoose
  .connect(mongoDBURL)
  .then(async () => { 
    // Obtém uma referência para a conexão do Mongoose
    const connect = mongoose.connection;
    console.log(`App connected to database: ${connect.host}`);
    // Inicializa o servidor Express
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Erro ao conectar ao banco de dados MongoDB:', error);
  });
