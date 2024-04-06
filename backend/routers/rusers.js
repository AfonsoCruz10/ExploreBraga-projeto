// rusers.js
import express from 'express';
import { Users } from "../mongo/esquemas.js";
import bcrypt from 'bcrypt';

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

//Rota para visualizar todos os utilizadores
router.get('/displayAllUsers', async (request, response) => {
    try {
        
        const users = await Users.find({}, '-HashedPassword');

        return response.status(200).json({
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log("Error fetching users:", error.message);
        response.status(500).json({ message: 'Internal server error! displayuser' });
    }
});


//Rota para criar uma nova conta
router.post('/createNewUser', async (req, res) => {
    try {
        const { username, email, password } = req.body;

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
            AdminPermission: false, 
            EventCreator: [],
            EventHasInterest: [],
            LocalCreator: [],
            LocalReviews: [],
            LocalFavorites: [],
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
        const { email, password } = req.body;

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

        if (isPasswordMatch) {
            // Autenticação bem-sucedida
            req.session.user = user; // Armazena o usuário na sessão
            return res.status(200).json({ message: "Login sucessfull!" });
        } else {
            return res.status(401).json({ message: "Wrong email or password!" });
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Server internal error! Login" });
    }
});

// Rota para logout de usuário
//falta acabar ver express session
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ message: 'Failed to log out' });
        } else {
            res.clearCookie('connect.sid'); // Limpa o cookie de sessão
            res.status(200).json({ message: 'Logout successful' });
        }
    });
});

export default router;