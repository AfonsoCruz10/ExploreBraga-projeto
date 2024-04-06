import mongoose from "mongoose";

export const PORT = 5555;

export const mongoDBURL = "mongodb+srv://ExploreBragaAdmin:Discord123@explorebraga.dy233rx.mongodb.net/ExploreBraga?retryWrites=true&w=majority";

// Função para conectar ao banco de dados e inicializar o servidor Express
export async function db(app) {
  try {
    // Conectar ao banco de dados MongoDB
    await mongoose.connect(mongoDBURL);

    // Obtém uma referência para a conexão do Mongoose
    const connect = mongoose.connection;
    console.log(`App connected to database: ${connect.host}`);

    // Inicializa o servidor Express
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  } catch (error) {
    console.log('Erro ao conectar ao banco de dados MongoDB:', error);
  }
}