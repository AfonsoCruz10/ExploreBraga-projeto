// rusers.js
import express from 'express';
import { Users, Events, Locations } from "../mongo/esquemas.js";
import bcrypt from 'bcrypt';
import { authPage } from "../middleware/middleware.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();

const validateEmail = (email) => {
    // Expressão regular para validar o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // Verificar se a senha tem pelo menos 8 caracteres e contém pelo menos um caractere maiúsculo
    return password.length >= 8 && /[A-Z]/.test(password);
};

//Rota para criar uma nova conta
router.post('/createNewUser', async (req, res) => {
    try {
        const { username, email, password ,birthDate} = req.body;

        if (username === "") {
            return res.status(400).json({ message: "Username needed!" });
        }

        if (email === "") {
            return res.status(400).json({ message: "Email needed!" });
        } else if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format!" });
        }

        if (password === "") {
            return res.status(400).json({ message: "Password needed!" });
        } else if (!validatePassword(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter!" });
        }

        if (!birthDate) {
            return res.status(400).json({ message: "BirthDate needed!" });
        }

        //verificar se o username ou email ja existem
        const existingUser = await Users.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'The username was already used! Please choose another one!' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'The email was already used! Please choose another one!' });
            }
        }

        //Utilizar a encriptacao
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //Criar um novo documento
        const newUser = new Users({
            username,
            email,
            HashedPassword: hashedPassword,
            birthDate,
            AdminPermission: false,
            EventCreator: [],
            EventHasInterest: [],
            LocalCreator: [],
            LocalReviews: [],
            LocalFavorites: []
        });

        //Salvar o utilizador na base de dados
        await newUser.save();

        //Enviar mensagem de sucesso
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error creating user: ', error);
        res.status(500).json({ message: 'Internal server error! creatuser' });
    }
});

// Rota para login de usuários
router.post('/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body; // Adicione 'remember' ao corpo da solicitação

        if (password === "" || email === "") {
            return res.status(401).json({ message: "You need to fill the credential info!" });
        }
        // Verifica se o usuário existe com o e-mail fornecido
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "This email is not registered yet!" });
        }
        //Compara a senha fornecida com a senha hasheada armazenada no banco de dados
        const isPasswordMatch = await bcrypt.compare(password, user.HashedPassword);

        let token;

        const tokenPayload = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        if (isPasswordMatch) {
            // Gere um token JWT
            if (remember) {
                token = jwt.sign(tokenPayload, process.env.MySecret, { expiresIn: '30d' });
            } else {
                token = jwt.sign(tokenPayload, process.env.MySecret)
            }

            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: "Wrong email or password!" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server internal error! Login" });
    }
});

router.get('/myaccount', authPage, async (req, res) => {

    try {
        // Verifique se a autenticação foi bem-sucedida
        if (!req.authenticated) {
            // Trate o caso em que a autenticação falhou
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }

        // Obter as informações do usuário autenticado
        const userid = req.userid;
        // Aqui você pode buscar mais informações do usuário no banco de dados usando o _id
        const user = await Users.findById(userid, '-HashedPassword');

        return res.status(200).json({ data: user });
    } catch (error) {
        console.log("Error fetching events:", error.message);
        response.status(500).json({ message: 'Internal server error! SelectEvents' });
    }
});


router.get('/showEventsUser', authPage, async (req, res) => {
    try {
        // Verifique se a autenticação foi bem-sucedida
        if (!req.authenticated) {
            // Trate o caso em que a autenticação falhou
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }

        // Obter as informações do usuário autenticado
        const userid = req.userid;

        // Busque os IDs de eventos associados ao usuário
        const userIDEvent = await Users.findById(userid).select("username EventCreator");

        // Verifique se o usuário não possui eventos associados
        if (userIDEvent.EventCreator.length === 0) {
            return res.status(200).json({
                count: 0,
                data: [],
            });
        }

        // Crie uma matriz para armazenar os detalhes de todos os eventos
        const eventsDetails = [];

        // Iterar sobre cada ID de evento e buscar os detalhes do evento no banco de dados
        for (const eventID of userIDEvent.EventCreator) {
            const event = await Events.findById(eventID);
            if (event) {
                eventsDetails.push(event);
            }
        }

        return res.status(200).json({
            count: eventsDetails.length,
            data: eventsDetails,
        });
        
    } catch (error) {
        console.log("Error fetching events:", error.message);
        return res.status(500).json({ message: 'Internal server error! SelectEvents' });
    }
});

router.put("/updateAccount", authPage, async (req, res) => {
    try {
        // Verifique se a autenticação foi bem-sucedida
        if (!req.authenticated) {
            // Trate o caso em que a autenticação falhou
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }

        // Obter as informações do usuário autenticado
        const userid = req.userid;

        // Busque os IDs de eventos associados ao usuário
        const user = await Users.findById(userid, '-HashedPassword');

        // Atualize as informações do usuário com os novos dados recebidos
        if (req.body.newUsername) {
            // Verifique se já existe algum usuário com o novo nome de usuário
            const existingUsernameUser = await Users.findOne({ username: req.body.newUsername });
            
            // Se encontrou um usuário com o mesmo nome de usuário, retorne um erro
            if (existingUsernameUser && existingUsernameUser._id.toString() !== userid) {
                return res.status(400).json({ message: 'The username was already used! Please choose another one!' });
            }
        
            // Se não encontrou nenhum usuário com o mesmo nome de usuário, atualize o nome de usuário
            user.username = req.body.newUsername;
        }

        if (req.body.newEmail) {
            // Verifique se já existe algum usuário com o novo email
            const existingEmailUser = await Users.findOne({ email: req.body.newEmail });
        
            // Se encontrou um usuário com o mesmo email, retorne um erro
            if (existingEmailUser && existingEmailUser._id.toString() !== userid) {
                return res.status(400).json({ message: 'The email was already used! Please choose another one!' });
            }
        
            // Se não encontrou nenhum usuário com o mesmo email, atualize o email
            user.email = req.body.newEmail;
        } 

        // Salve as alterações no banco de dados
        await user.save();

        // Gere um novo token com base nas informações atualizadas do usuário
        const tokenPayload = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(tokenPayload, process.env.MySecret);

        // Envie uma resposta de sucesso
        res.status(200).json({ message: 'User information updated successfully', user , token });

    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Internal server error! updateAccount' });
    }
});


export default router;