import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate do React Router
import api from '../api'; // Certifique-se de que o axios está configurado corretamente

function LoginPage() {
  const [email, setEmail] = useState(''); // Estado para o email
  const [password, setPassword] = useState(''); // Estado para a senha
  const [message, setMessage] = useState(''); // Estado para a mensagem de sucesso ou erro
  const navigate = useNavigate(); // Hook para navegar entre as páginas

  const handleLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      // Envia a requisição para o backend com o email e a senha
      const { data } = await api.post('/users/login', { email, password });

      // Armazena o token JWT no localStorage
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('name', data.name); // Armazena o nome retornado pelo backend

      setMessage('Login bem-sucedido!');

      // Redireciona o usuário para a página de produtos
      navigate('/'); // Redireciona para a página de produtos após login bem-sucedido
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Atualiza o valor do email
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Atualiza o valor da senha
        />
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>} {/* Exibe a mensagem de sucesso ou erro */}
    </div>
  );
}

export default LoginPage;
