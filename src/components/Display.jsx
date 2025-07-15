// src/components/Display.jsx
import React, { useState, useEffect } from 'react';
import { carregarPacientes } from '../utils/localStorage'; // Importa a função de carregar pacientes
import './Display.css'; // Importa o CSS específico deste componente

function Display() {
  // Estado para armazenar a lista completa de pacientes
  const [pacientes, setPacientes] = useState([]);
  // Estado para armazenar o paciente atualmente em destaque no display
  const [currentPatientDisplay, setCurrentPatientDisplay] = useState(null);
  // Estado para armazenar a lista de próximos pacientes
  const [nextPatientsList, setNextPatientsList] = useState([]);

  // Mapeamento de prioridades para um valor numérico (quanto menor, maior a prioridade)
  const priorityOrder = {
    'emergencia': 1,
    'muito-urgente': 2,
    'urgente': 3,
    'pouco-urgente': 4,
    'nao-urgente': 5
  };

  // Função de ordenação de pacientes por prioridade
  const sortPacientesByPriority = (pacientesArray) => {
    return [...pacientesArray].sort((a, b) => {
      const priorityA = priorityOrder[a.prioridade] || 99;
      const priorityB = priorityOrder[b.prioridade] || 99;

      if (priorityA === priorityB) {
        const fichaA = parseInt(a.ficha.replace('F', ''));
        const fichaB = parseInt(b.ficha.replace('F', ''));
        return fichaA - fichaB;
      }
      return priorityA - fichaB; // Use ficha para desempate
    });
  };

  // Função principal para renderizar o display
  const renderDisplay = () => {
    const loadedPatients = carregarPacientes();
    setPacientes(loadedPatients); // Atualiza o estado global de pacientes

    let currentPatient = null;
    let currentPatientLoc = '';

    // 1. Procurar paciente em atendimento médico
    currentPatient = loadedPatients.find(p => p.status === 'em_atendimento');
    if (currentPatient) {
      currentPatientLoc = 'Consultório Médico';
    } else {
      // 2. Se ninguém em atendimento médico, procurar paciente em triagem
      currentPatient = loadedPatients.find(p => p.status === 'em_triagem');
      if (currentPatient) {
        currentPatientLoc = 'Guichê de Triagem';
      }
    }

    // Atualiza o estado do paciente atualmente em destaque
    setCurrentPatientDisplay(currentPatient);

    // Atualizar a lista de próximos pacientes
    const nextPatientsFiltered = loadedPatients.filter(p =>
      p.status === 'aguardando_triagem' || p.status === 'aguardando_medico'
    );
    const sortedNextPatients = sortPacientesByPriority(nextPatientsFiltered);

    // Exclui o paciente atualmente em destaque da lista de próximos
    const finalNextPatients = sortedNextPatients.filter(p =>
      !currentPatient || p.ficha !== currentPatient.ficha
    );

    // Limita a 5 próximos na fila
    setNextPatientsList(finalNextPatients.slice(0, 5));
  };

  // Efeito para carregar os pacientes e configurar o intervalo de atualização
  useEffect(() => {
    renderDisplay(); // Renderiza na montagem inicial
    const intervalId = setInterval(renderDisplay, 3000); // Atualiza a cada 3 segundos

    // Limpa o intervalo quando o componente é desmontado para evitar vazamento de memória
    return () => clearInterval(intervalId);
  }, []); // O array vazio garante que o efeito rode apenas uma vez na montagem e limpeza na desmontagem

  return (
    <div className="display-wrapper">
      {/* Botão de Voltar (útil durante o desenvolvimento e testes) */}
      <a href="/" className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
        Menu
      </a>

      {/* Seção Principal: Paciente Sendo Chamado Agora */}
      <div className="main-display">
        <h1>PACIENTE SENDO CHAMADO</h1>
        <div id="currentPatientSection" className="current-patient-info">
          <div className="name">
            {currentPatientDisplay ? currentPatientDisplay.nome.toUpperCase() : 'NENHUM PACIENTE SENDO CHAMADO'}
          </div>
          {currentPatientDisplay && (
            <>
              <div className="ficha">FICHA: {currentPatientDisplay.ficha || 'N/A'}</div>
              <div className="location">DIRIJA-SE AO: {currentPatientDisplay.status === 'em_atendimento' ? 'Consultório Médico' : 'Guichê de Triagem'}</div>
            </>
          )}
        </div>
      </div>

      {/* Seção Lateral: Próximos na Fila */}
      <div className="sidebar-queue">
        <h2>PRÓXIMOS NA FILA</h2>
        <ul id="nextPatientsList" className="next-patients-list">
          {nextPatientsList.length === 0 ? (
            <li className="empty-display-state">Nenhum paciente aguardando.</li>
          ) : (
            nextPatientsList.map(paciente => (
              <li key={paciente.ficha}>
                <strong>{paciente.nome}</strong>
                <span>Ficha: {paciente.ficha || 'N/A'}</span>
                <span>Prioridade: <span className={`priority-display-tag ${paciente.prioridade}`}>{paciente.prioridade.replace('-', ' ')}</span></span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Display;
