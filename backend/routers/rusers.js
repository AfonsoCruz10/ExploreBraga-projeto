// rusers.js
import express from 'express';
import { Users } from "../models/esquemas.js";

const router = express.Router();

// Rota para login de usuários
router.post('/login', async (req, res) => {
    try {
        const { emailreq, passreq } = req.body;
        
        if (passreq === "" || emailreq === "") { 
            return res.status(401).json({ message: "Credenciais em falta" });
        } 
        // Verifica se o usuário existe com o e-mail fornecido
        const user = await Users.findOne({ email: emailreq });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        if (user.passHash === passreq) {
            return res.status(200).json({ message: "Login bem-sucedido" });
        } else {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

export default router;
