// src/components/Cadastro.jsx
import React, { useState } from 'react';
import { salvarPacientes, carregarPacientes, gerarFicha } from '../utils/localStorage'; // Importa as funções do localStorage
import './Cadastro.css'; // Importa o CSS específico deste componente

function Cadastro() {
  // Estados para controlar os valores dos campos do formulário
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [prioridade, setPrioridade] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // Carrega os pacientes existentes
    let pacientes = carregarPacientes();

    // Cria o novo objeto paciente
    const novoPaciente = {
      ficha: gerarFicha(), // Usa a função gerarFicha do localStorage.js
      nome: nome,
      idade: parseInt(idade), // Converte idade para número
      sexo: sexo,
      prioridade: prioridade,
      status: 'aguardando_triagem', // Status inicial ao cadastrar
      isCalled: false, // Novo paciente não está chamado
      calledTime: null,
      conclusionTime: null,
      motivo: 'Não informado' // Pode ser adicionado ao formulário futuramente
    };

    // Adiciona o novo paciente e salva no localStorage
    pacientes.push(novoPaciente);
    salvarPacientes(pacientes);

    alert('Paciente cadastrado com sucesso!'); // Feedback ao usuário

    // Limpa o formulário após o cadastro
    setNome('');
    setIdade('');
    setSexo('');
    setPrioridade('');
  };

  return (
    <div className="container">
      {/* Botão de Voltar - no React, usaremos navegação via roteador ou window.history */}
      <a href="/" className="back-button"> {/* Volta para a raiz (menu principal) */}
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
        Voltar ao Menu
      </a>

      <h1>Cadastro de Paciente</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome Completo:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome do paciente"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="idade">Idade:</label>
          <input
            type="number"
            id="idade"
            name="idade"
            placeholder="Idade do paciente"
            required
            min="0"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sexo">Sexo:</label>
          <select
            id="sexo"
            name="sexo"
            required
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="prioridade">Prioridade de Atendimento:</label>
          <select
            id="prioridade"
            name="prioridade"
            required
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="">Selecione a gravidade</option>
            <option value="emergencia">Emergência (Vermelho)</option>
            <option value="muito-urgente">Muito Urgente (Laranja)</option>
            <option value="urgente">Urgente (Amarelo)</option>
            <option value="pouco-urgente">Pouco Urgente (Verde)</option>
            <option value="nao-urgente">Não Urgente (Azul)</option>
          </select>
        </div>
        <button type="submit">Cadastrar Paciente</button>
      </form>
    </div>
  );
}

export default Cadastro;