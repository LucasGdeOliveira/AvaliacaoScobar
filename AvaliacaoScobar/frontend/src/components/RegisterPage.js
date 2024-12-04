import React, { useState } from 'react';
import api from '../api';  // Certifique-se de que sua configuração do axios está correta

function RegisterPage() {
  const [name, setName] = useState('');  // Estado para armazenar o nome do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Enviando dados para o backend
      const response = await api.post('/users/novouser', {
        name,    // Enviando o nome junto com o email e senha
        email,  
        password,
      });

      // Exibindo mensagem de sucesso
      setMessage(`Usuário criado! ID: ${response.data.id}`);
    } catch (error) {
      // Exibindo mensagem de erro
      setMessage('Erro ao registrar usuário.');
    }
  };

  return (
    <div>
      <h1>Registrar Usuário</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome de usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}  // Atualizando o estado de nome
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>} {/* Exibindo a mensagem de sucesso ou erro */}
    </div>
  );
}

export default RegisterPage;
