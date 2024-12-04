import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null); // Estado para o produto selecionado
  const navigate = useNavigate();

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

    const fetchProdutos = async () => {
      try {
        const response = await axios.get('/produtos', getAuthHeaders());
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        setMessage('Erro ao carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();

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

  const createProduto = async () => {
    if (!nome || !preco || !estoque) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const precoFloat = parseFloat(preco);
    const estoqueInt = parseInt(estoque, 10);

    if (isNaN(precoFloat) || precoFloat <= 0) {
      setMessage('Preço inválido.');
      return;
    }

    if (isNaN(estoqueInt) || estoqueInt < 0) {
      setMessage('Estoque inválido.');
      return;
    }

    try {
      const response = await axios.post(
        '/produtos',
        {
          nome,
          descricao: descricao || '',
          preco: precoFloat,
          estoque: estoqueInt,
          usuario: userName,
        },
        getAuthHeaders()
      );
      setProdutos([...produtos, response.data]);
      setMessage('Produto criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
      setMessage('Erro ao criar o produto.');
    }
  };

  const editarProduto = (produto) => {
    setProdutoSelecionado(produto);  // Aqui você seleciona o produto para edição
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
  };

  const updateProduto = async () => {
    if (!nome || !preco || !estoque) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const precoFloat = parseFloat(preco);
    const estoqueInt = parseInt(estoque, 10);

    if (isNaN(precoFloat) || precoFloat <= 0) {
      setMessage('Preço inválido.');
      return;
    }

    if (isNaN(estoqueInt) || estoqueInt < 0) {
      setMessage('Estoque inválido.');
      return;
    }

    try {
      const response = await axios.put(
        `/produtos/${produtoSelecionado.id}`,
        {
          nome,
          descricao: descricao || '',
          preco: precoFloat,
          estoque: estoqueInt,
          usuario: userName,
        },
        getAuthHeaders()
      );
      setProdutos(produtos.map(p => p.id === produtoSelecionado.id ? response.data : p));
      setProdutoSelecionado(null); // Limpa a seleção do produto após atualização
      setMessage('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
      setMessage('Erro ao atualizar o produto.');
    }
  };

  const deleteProduto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`/produtos/${id}`, getAuthHeaders());
        setProdutos(produtos.filter(p => p.id !== id));
        setMessage('Produto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir o produto:', error);
        setMessage('Erro ao excluir o produto.');
      }
    }
  };

  return (
    <div>
      <h1>Produtos</h1>
      {message && <p>{message}</p>}

      <form onSubmit={(e) => { 
        e.preventDefault(); 
        if (produtoSelecionado) { 
          updateProduto(); 
        } else { 
          createProduto(); 
        } 
      }}>
        {/* Campo de nome */}
        <label>
          Nome:
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Nome do produto"
          />
        </label>
        <br />

        {/* Campo de descrição */}
        <label>
          Descrição:
          <input 
            type="text" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
            placeholder="Descrição do produto"
          />
        </label>
        <br />

        {/* Campo de preço */}
        <label>
          Preço:
          <input 
            type="number" 
            value={preco} 
            onChange={(e) => setPreco(e.target.value)} 
            placeholder="Preço do produto"
          />
        </label>
        <br />

        {/* Campo de estoque */}
        <label>
          Estoque:
          <input 
            type="number" 
            value={estoque} 
            onChange={(e) => setEstoque(e.target.value)} 
            placeholder="Quantidade em estoque"
          />
        </label>
        <br />

        {/* Botão de submit */}
        <button type="submit">{produtoSelecionado ? 'Atualizar Produto' : 'Adicionar Produto'}</button>
      </form>

      {loading ? <p>Carregando produtos...</p> : (
        <ul>
          {produtos.map(produto => (
            <li key={produto.id}>
              <p>Nome: {produto.nome}</p>
              <p>Descrição: {produto.descricao}</p>
              <p>Preço: {produto.preco}</p>
              <p>Estoque: {produto.estoque}</p>
              <button onClick={() => editarProduto(produto)}>Editar</button>
              <button onClick={() => deleteProduto(produto.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProdutosPage;
