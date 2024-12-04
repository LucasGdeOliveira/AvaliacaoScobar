import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersPage = () => {
  const [users, setUsers] = useState([]); // Estado para armazenar os usuários
  const [message, setMessage] = useState(''); // Estado para mensagens de erro ou sucesso
  const [userId, setUserId] = useState(''); // Estado para armazenar o ID do usuário a ser pesquisado
  const [searchedUser, setSearchedUser] = useState(null); // Estado para armazenar o usuário pesquisado
  const [token, setToken] = useState(null); // Estado para armazenar o token
  const [userName, setUserName] = useState(''); // Estado para armazenar o nome do usuário
  const navigate = useNavigate();

  // Função para obter o cabeçalho de autenticação
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    setToken(token);
    if (!token) {
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Função para verificar o token
  const verifyToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiry = decodedToken.exp * 1000;
      if (expiry < Date.now()) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('name');
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // UseEffect para verificar o token ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token || !verifyToken()) {
      navigate('/login');
      return;
    }

    const loggedUserName = localStorage.getItem('name');
    if (loggedUserName) {
      setUserName(loggedUserName);
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/users/allusers', getAuthHeaders());
        setUsers(data);
      } catch (error) {
        setMessage('Erro ao buscar usuários. Tente novamente mais tarde.');
      }
    };

    fetchUsers();

    // Adiciona o ouvinte para o evento de fechamento/recarregamento da página
    const handleBeforeUnload = () => {
      localStorage.removeItem('jwtToken'); // Remove o token
      localStorage.removeItem('name'); // Remove o nome do usuário
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpeza do ouvinte quando o componente for desmontado
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  // Função para buscar o usuário por ID
  const fetchUserById = async () => {
    if (!userId) {
      setMessage('Por favor, insira um ID de usuário.');
      return;
    }

    try {
      const { data } = await axios.get(`/users/getUserById/${userId}`, getAuthHeaders());
      setSearchedUser(data);  // Armazenando o usuário pesquisado
      setMessage('');
    } catch (error) {
      setMessage('Erro ao buscar o usuário. Verifique o ID e tente novamente.');
    }
  };

  return (
    <div>
      <h1>Usuários</h1>

      {/* Campo de busca por ID */}
      <div>
        <input
          type="text"
          placeholder="Digite o ID do usuário"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchUserById}>Pesquisar por ID</button>
      </div>

      {/* Exibindo a mensagem de erro/sucesso */}
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {/* Exibindo o usuário pesquisado */}
      {searchedUser && (
        <div>
          <h2>Usuário Encontrado:</h2>
          <p><strong>ID:</strong> {searchedUser.id}</p>
          <p><strong>Nome:</strong> {searchedUser.name}</p>
          <p><strong>Email:</strong> {searchedUser.email}</p>
        </div>
      )}

      {/* Lista de todos os usuários */}
      <h2>Todos os Usuários:</h2>
      <ul>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <strong>ID:</strong> {user.id}, <strong>Nome:</strong> {user.name}, <strong>Email:</strong> {user.email}
            </li>
          ))
        ) : (
          <p>Carregando usuários...</p>
        )}
      </ul>
    </div>
  );
};

export default UsersPage;
