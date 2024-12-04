import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CarrinhoPage = () => {
  const [carrinho, setCarrinho] = useState(null);
  const [productId, setProductId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(5); // Quantidade inicial de itens visíveis
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return {};
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const verifyToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiry = decodedToken.exp * 1000;
      if (expiry < Date.now()) {
        localStorage.removeItem('jwtToken'); // Remove o token se estiver expirado
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem('jwtToken'); // Remove o token se for inválido
      return false;
    }
  };

  useEffect(() => {
    // Verifica o token no carregamento da página
    if (!verifyToken()) {
      navigate('/login'); // Redireciona para a página de login se o token for inválido
      return;
    }

    fetchCarrinho();
  }, [navigate]);

  const fetchCarrinho = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/carrinho', getAuthHeaders());
      setCarrinho(response.data.cart);
    } catch (error) {
      console.error('Erro ao carregar o carrinho:', error);
      setMessage('Erro ao carregar o carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const addProdutoToCarrinho = async () => {
    if (!productId || !quantidade) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const quantidadeInt = parseInt(quantidade, 10);
    if (isNaN(quantidadeInt) || quantidadeInt <= 0) {
      setMessage('Quantidade inválida.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        '/carrinho/add',
        { productId, quantidade: quantidadeInt },
        getAuthHeaders()
      );
      setCarrinho(response.data.cart);
      setMessage('Produto adicionado ao carrinho com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      setMessage('Erro ao adicionar produto ao carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const removeProdutoFromCarrinho = async (produtoId) => {
    if (!produtoId) {
      setMessage('Erro: produtoId não definido.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`/carrinho/remove/${produtoId}`, getAuthHeaders());
      if (response.data && response.data.cart) {
        setCarrinho(response.data.cart);
        setMessage('Produto removido do carrinho com sucesso!');
      } else {
        setMessage('Erro ao remover produto do carrinho.');
      }
    } catch (error) {
      console.error('Erro ao remover produto do carrinho:', error);
      setMessage('Erro ao remover produto do carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductId('');
    setQuantidade('');
  };

  const loadMoreItems = () => {
    setItemsToShow(itemsToShow + 5); // Incrementa o número de itens visíveis
  };

  return (
    <div>
      <h1>Carrinho</h1>
      {message && <p>{message}</p>}

      <h2>Adicionar Produto</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addProdutoToCarrinho();
        }}
      >
        <div>
          <label>ID do Produto:</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Adicionar ao Carrinho
        </button>
      </form>

      <h2>Itens no Carrinho</h2>
      {loading ? (
        <p>Carregando carrinho...</p>
      ) : carrinho && carrinho.items && carrinho.items.length > 0 ? (
        <>
          <ul>
            {carrinho.items.slice(0, itemsToShow).map((item) => (
              <li key={item.produtoId}>
                <strong>{item.nome}</strong> - {item.quantidade} unidades - Total: R$
                {parseFloat(item.totalPrice).toFixed(2)}
                <div>
                  <button onClick={() => removeProdutoFromCarrinho(item.produtoId)}>
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {carrinho.items.length > itemsToShow && (
            <button onClick={loadMoreItems}>Mostrar mais</button>
          )}
        </>
      ) : (
        <p>Carrinho vazio.</p>
      )}
    </div>
  );
};

export default CarrinhoPage;
