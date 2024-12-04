import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const [carrinho, setCarrinho] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);
  const navigate = useNavigate();

  // Função para obter cabeçalhos de autenticação
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // Verifica se o token JWT é válido e não expirou
  const verifyToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do JWT
      const expiry = decodedToken.exp * 1000; // Converte o tempo de expiração para milissegundos
      if (expiry < Date.now()) {
        localStorage.removeItem('jwtToken'); // Remove o token se estiver expirado
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      localStorage.removeItem('jwtToken'); // Remove o token se for inválido
      return false;
    }
  };

  // Hook para verificar o token e carregar o carrinho
  useEffect(() => {
    if (!verifyToken()) {
      setMessage('Sua sessão expirou. Por favor, faça login novamente.');
      navigate('/login'); // Redireciona para a página de login se o token for inválido
    } else {
      fetchCarrinho(); // Carrega o carrinho se o token for válido
    }
  }, [navigate]);

  // Carrega o carrinho do usuário
  const fetchCarrinho = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/carrinho', getAuthHeaders());
      setCarrinho(response.data.cart);
    } catch (error) {
      console.error('Erro ao carregar o carrinho:', error);
      setMessage('Erro ao carregar o carrinho. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Processa o pagamento com o método escolhido
  const handlePayment = async (method) => {
    if (!carrinho || carrinho.items.length === 0) {
      setMessage('Carrinho vazio. Adicione itens antes de prosseguir com o pagamento.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = method === 'credit-card' ? '/payment/credit-card' : '/payment/pix';
      const response = await axios.post(endpoint, {}, getAuthHeaders());
      setMessage(response.data.message || 'Pagamento realizado com sucesso!');
      setCarrinho(null); // Limpa o carrinho após o pagamento
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setMessage('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Busca o status da transação com base no ID fornecido
  const fetchTransactionStatus = async () => {
    if (!transactionId) {
      setMessage('Por favor, insira um ID de transação para verificar o status.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/payment/status/${transactionId}`, getAuthHeaders());
      setTransactionStatus(response.data);
    } catch (error) {
      console.error('Erro ao buscar status da transação:', error);
      setMessage('Erro ao buscar status da transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Pagamento</h1>
      {message && <p>{message}</p>}

      {/* Resumo do carrinho */}
      <h2>Resumo do Carrinho</h2>
      {loading ? (
        <p>Carregando carrinho...</p>
      ) : carrinho && carrinho.items && carrinho.items.length > 0 ? (
        <div>
          <ul>
            {carrinho.items.map((item) => (
              <li key={item.produtoId}>
                <strong>{item.nome}</strong> - {item.quantidade} unidades - Total: R$
                {parseFloat(item.totalPrice).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>
            <strong>
              Total Geral: R$
              {carrinho.items
                .reduce((acc, item) => acc + parseFloat(item.totalPrice), 0)
                .toFixed(2)}
            </strong>
          </p>
        </div>
      ) : (
        <p>Carrinho vazio.</p>
      )}

      {/* Botões para pagamento */}
      <div>
        <button onClick={() => handlePayment('credit-card')} disabled={loading}>
          Pagar com Cartão de Crédito
        </button>
        <button onClick={() => handlePayment('pix')} disabled={loading}>
          Pagar com PIX
        </button>
      </div>

      {/* Busca do status da transação */}
      <div>
        <h2>Verificar Status da Transação</h2>
        <label>ID da Transação:</label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <button onClick={fetchTransactionStatus} disabled={loading}>
          Verificar Status
        </button>
      </div>

      {/* Exibição do status da transação */}
      {transactionStatus && (
        <div>
          <h3>Status da Transação:</h3>
          <p>ID: {transactionStatus.id}</p>
          <p>Status: {transactionStatus.status}</p>
          <p>Valor Total: R$ {parseFloat(transactionStatus.valortotal).toFixed(2)}</p>
          <p>Método de Pagamento: {transactionStatus.metodopayment}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
