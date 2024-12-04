import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UsersPage from './components/UsersPage';
import ProdutosPage from './components/ProdutosPage';
import CarrinhoPage from './components/CarrinhoPage';
import PaymentPage from './components/PaymentPage';
import FornecedoresPage from './components/FornecedoresPage';
import NavBar from './components/NavBar'; // Importando o NavBar
import Footer from './components/Footer'; // Importando o Footer
import './App.css'; // Importação do CSS

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> {/* Adicionando o NavBar */}
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/carrinho" element={<CarrinhoPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/fornecedores" element={<FornecedoresPage />} />
          </Routes>
        </main>
        <Footer /> {/* Adicionando o Footer */}
      </div>
    </Router>
  );
}

export default App;