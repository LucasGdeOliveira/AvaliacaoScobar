import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FornecedoresPage = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null); // Estado para o fornecedor selecionado
  const navigate = useNavigate();

  // Função para obter os cabeçalhos de autenticação
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

  // Função para verificar a validade do token JWT
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

  // UseEffect para verificar o token ao carregar a página e buscar fornecedores
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

    const fetchFornecedores = async () => {
      try {
        const response = await axios.get('/fornecedores', getAuthHeaders());
        setFornecedores(response.data);
      } catch (error) {
        console.error('Erro ao carregar os fornecedores:', error);
        setMessage('Erro ao carregar os fornecedores.');
      } finally {
        setLoading(false);
      }
    };

    fetchFornecedores();

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

  // Função para criar um novo fornecedor
  const createFornecedor = async () => {
    if (!nome || !cnpj || !email || !telefone || !endereco) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await axios.post(
        '/fornecedores',
        {
          nome,
          cnpj,
          email,
          telefone,
          endereco,
          usuario: userName,
        },
        getAuthHeaders()
      );
      setFornecedores([...fornecedores, response.data]);
      setMessage('Fornecedor criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar o fornecedor:', error);
      setMessage('Erro ao criar o fornecedor.');
    }
  };

  // Função para selecionar o fornecedor para edição
  const editarFornecedor = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);  // Seleciona o fornecedor para edição
    setNome(fornecedor.nome);
    setCnpj(fornecedor.cnpj);
    setEmail(fornecedor.email);
    setTelefone(fornecedor.telefone);
    setEndereco(fornecedor.endereco);
  };

  // Função para atualizar o fornecedor
  const updateFornecedor = async () => {
    if (!nome || !cnpj || !email || !telefone || !endereco) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const response = await axios.put(
        `/fornecedores/${fornecedorSelecionado.id}`,
        {
          nome,
          cnpj,
          email,
          telefone,
          endereco,
          usuario: userName,
        },
        getAuthHeaders()
      );
      setFornecedores(fornecedores.map(f => f.id === fornecedorSelecionado.id ? response.data : f));
      setFornecedorSelecionado(null); // Limpa a seleção após a atualização
      setMessage('Fornecedor atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o fornecedor:', error);
      setMessage('Erro ao atualizar o fornecedor.');
    }
  };

  // Função para excluir um fornecedor
  const deleteFornecedor = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await axios.delete(`/fornecedores/${id}`, getAuthHeaders());
        setFornecedores(fornecedores.filter(f => f.id !== id));
        setMessage('Fornecedor excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir o fornecedor:', error);
        setMessage('Erro ao excluir o fornecedor.');
      }
    }
  };

  return (
    <div>
      <h1>Fornecedores</h1>
      {message && <p>{message}</p>}

      <form onSubmit={(e) => { 
        e.preventDefault(); 
        if (fornecedorSelecionado) { 
          updateFornecedor(); 
        } else { 
          createFornecedor(); 
        } 
      }}>
        {/* Campos do Formulário de Fornecedor */}
        <label>
          Nome:
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Nome do fornecedor"
          />
        </label>
        <br />

        <label>
          CNPJ:
          <input 
            type="text" 
            value={cnpj} 
            onChange={(e) => setCnpj(e.target.value)} 
            placeholder="CNPJ do fornecedor"
          />
        </label>
        <br />

        <label>
          E-mail:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="E-mail do fornecedor"
          />
        </label>
        <br />

        <label>
          Telefone:
          <input 
            type="text" 
            value={telefone} 
            onChange={(e) => setTelefone(e.target.value)} 
            placeholder="Telefone do fornecedor"
          />
        </label>
        <br />

        <label>
          Endereço:
          <input 
            type="text" 
            value={endereco} 
            onChange={(e) => setEndereco(e.target.value)} 
            placeholder="Endereço do fornecedor"
          />
        </label>
        <br />

        <button type="submit">{fornecedorSelecionado ? 'Atualizar Fornecedor' : 'Adicionar Fornecedor'}</button>
      </form>

      {loading ? <p>Carregando fornecedores...</p> : (
        <ul>
          {fornecedores.map(fornecedor => (
            <li key={fornecedor.id}>
              <p>Nome: {fornecedor.nome}</p>
              <p>CNPJ: {fornecedor.cnpj}</p>
              <p>Email: {fornecedor.email}</p>
              <p>Telefone: {fornecedor.telefone}</p>
              <p>Endereço: {fornecedor.endereco}</p>
              <button onClick={() => editarFornecedor(fornecedor)}>Editar</button>
              <button onClick={() => deleteFornecedor(fornecedor.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FornecedoresPage;
