// src/App.jsx
import React, { useState } from 'react';
import './App.css'; // Estilos globais para body e App container

// Importa os outros componentes de página
import Cadastro from './components/Cadastro';
import Triagem from './components/Triagem';
import Atendimento from './components/Atendimento';
import Display from './components/Display';

function App() {
  // Estado para controlar qual página está visível
  const [currentPage, setCurrentPage] = useState('menu'); // 'menu' é a página inicial

  // Função para mudar a página
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  // Função para renderizar o componente da página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return (
          // Conteúdo do Menu.jsx movido para cá
          <div className="menu-container">
            <h1>Menu Principal</h1>
            <div className="menu-grid">
              <div className="menu-item" onClick={() => navigateTo('cadastro')}>
                {/* SVG para o ícone de Cadastro Cliente */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1zM12 14c2.67 0 5.34.89 6 2.5v2.2c0 .3-.1.5-.3.7-.6.6-1.5 1-2.7 1h-6.1c-1.2 0-2.1-.4-2.7-1-.2-.2-.3-.4-.3-.7v-2.2C6.66 14.89 9.33 14 12 14z" opacity=".3"/>
                    <path d="M12 12c-2.48 0-4.5 2.02-4.5 4.5V20c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-3.5c0-2.48-2.02-4.5-4.5-4.5zm0 2c2.67 0 5.34.89 6 2.5v2.2c0 .3-.1.5-.3.7-.6.6-1.5 1-2.7 1h-6.1c-1.2 0-2.1-.4-2.7-1-.2-.2-.3-.4-.3-.7v-2.2C6.66 14.89 9.33 14 12 14zM12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1zM12 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                </svg>
                Cadastro Cliente
              </div>
              <div className="menu-item" onClick={() => navigateTo('triagem')}>
                {/* SVG para o ícone de Triagem */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 16h6v2H9v-2zm0-4h6v2H9v-2zm-3-4H6V4h1v4h2v2H6z" opacity=".3"/>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm0 5V3.5L18.5 8H15c-.28 0-.5-.22-.5-.5zM18 20H6V4h7v5h5v11zm-9-4h6v2H9zm0-4h6v2H9z"/>
                </svg>
                Triagem
              </div>
              <div className="menu-item" onClick={() => navigateTo('atendimento')}>
                {/* SVG para o ícone de Atendimento Médico */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM7 13h5v2H7v-2zm10 0h-3v2h3v-2zm-3-3V7H7v3h7z" opacity=".3"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-7h5v2H7v-2zm10 0h-3v2h3v-2zm-3-3V7H7v3h7z"/>
                </svg>
                Atendimento Médico
              </div>
              <div className="menu-item" onClick={() => navigateTo('display')}>
                {/* SVG para o ícone de Display */}
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" opacity=".3"/>
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/>
                </svg>
                Display
              </div>
            </div>
          </div>
        );
      case 'cadastro':
        return <Cadastro onBackToMenu={() => navigateTo('menu')} />;
      case 'triagem':
        return <Triagem onBackToMenu={() => navigateTo('menu')} />;
      case 'atendimento':
        return <Atendimento onBackToMenu={() => navigateTo('menu')} />;
      case 'display':
        return <Display onBackToMenu={() => navigateTo('menu')} />;
      default:
        return <div>Página não encontrada!</div>;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
