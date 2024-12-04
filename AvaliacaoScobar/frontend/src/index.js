import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Você pode importar o CSS se necessário
import App from './App';  // O componente principal da sua aplicação
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();  // Para medir o desempenho da aplicação
