// middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Users } from '../mongo/esquemas.js';

dotenv.config();

export const authPage = async (req, res, next) => {
    try {
        // Obtenha o token JWT do cabeçalho da solicitação
        let token = req.headers.authorization;
        
        //console.log("authPage req.headers: - - - - - - ", req.headers)
        //console.log("authPage token: - - - - - - ", token)

        // Remova "Bearer " do token, se estiver presente
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        
        // Verifique e decodifique o token JWT
        const decoded = jwt.verify(token, process.env.MySecret);

        // Se o token for válido, você pode acessar as informações decodificadas
        const { _id, email } = decoded;

        // Aqui você pode buscar mais informações do usuário no banco de dados usando o _id
        const user = await Users.findById(_id).select("email AdminPermission");

        // Verifique se o utilizador existe no banco de dados e se os dados token são iguais
        if (!user || user.email !== email) {
            req.authenticated = false;
            return next();
        }
        
        // Retorne as informações do usuário para o cliente
        req.admin = user.AdminPermission;
        req.userid = user._id;
        req.authenticated = true;
        next();
    } catch (error) {
        req.authenticated = false;
        next();
    }
};