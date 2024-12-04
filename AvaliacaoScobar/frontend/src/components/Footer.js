import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© 2024 Minha Loja. Todos os direitos reservados.</p>
        <ul className="footer-links">
          <li><a href="/sobre">Sobre</a></li>
          <li><a href="/contato">Contato</a></li>
          <li><a href="/privacidade">Política de Privacidade</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;