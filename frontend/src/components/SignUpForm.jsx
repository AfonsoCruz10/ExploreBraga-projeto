import React, { useState } from 'react';

function SignUpForm() {
  // Estado inicial usando o hook useState
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Função para lidar com as mudanças nos inputs do sign up
  const handleChange = (e) => {
    // Extrai o nome e o valor do input que foi alterado
    const { name, value } = e.target;
    // Atualiza o estado do sign up com os novos dados
    setFormData({
      ...formData, // Mantém os dados existentes
      [name]: value // Atualiza o campo correspondente ao input alterado
    });
  };

  // Função para lidar com o envio do sign up
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do sign up
    // É aqui que vou enviar as cenas para o server
    console.log(formData);
  };

  // Coloca o SignUp sob a forma de interface
  return (
    <div>
      <h2>Sign Up</h2>
      {/* Define o sign up com um evento onSubmit que chama a função handleSubmit quando o sign up é enviado */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          {/* Input para o username, com um evento onChange que chama a função handleChange */}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          {/* Input para o email, com um evento onChange que chama a função handleChange */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          {/* Input para a pass, com um evento onChange que chama a função handleChange */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          {/* Input para confirmar a pass, com um evento onChange que chama a função handleChange */}
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {/* Botão de submissão do sign up */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignUpForm;