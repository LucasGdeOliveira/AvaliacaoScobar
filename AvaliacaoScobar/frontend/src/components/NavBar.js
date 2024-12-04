import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Minha Loja</Link>
        <ul className="navbar-links">
          <li><Link to="/">Início</Link></li>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/carrinho">Carrinho</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/registro">Cadastrar</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;