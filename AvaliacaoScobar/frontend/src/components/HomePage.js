import React from 'react';
import { Link } from 'react-router-dom';  // Usando o Link do React Router

function HomePage() {
  return (
    <div>
      <h1>Bem-vindo a Loja</h1>
      <div>
        {/* Links para navegação */}
        <Link to="/registro" className="btn">Criar Conta     </Link>
        <Link to="/login" className="btn">Fazer Login     </Link>
        <Link to="/users" className="btn">Usuários       </Link>
        <Link to="/produtos" className="btn">Produtos    </Link>
        <Link to="/carrinho" className="btn">Carrinho     </Link>
        <Link to="/payment" className="btn">Pagamento     </Link>
        <Link to="/fornecedores" className="btn">Fornecedores     </Link>

      </div>
    </div>
  );
}

export default HomePage;
