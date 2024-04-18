import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// Função para conectar ao banco de dados e inicializar o servidor Express
export async function db(app) {
  try {
    // Conectar ao banco de dados MongoDB
    await mongoose.connect(process.env.mongoDBURL);

    // Obtém uma referência para a conexão do Mongoose
    const connect = mongoose.connection;
    console.log(`App connected to database: ${connect.host}`);

    // Inicializa o servidor Express
    app.listen(process.env.PORT, () => {
      console.log(`App is listening to port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.log('Erro ao conectar ao banco de dados MongoDB:', error);
  }
}
