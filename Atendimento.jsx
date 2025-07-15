// src/components/Atendimento.jsx
import React, { useState, useEffect } from 'react';
import { salvarPacientes, carregarPacientes } from '../utils/localStorage';
import './Atendimento.css';

// Recebe a prop onBackToMenu
function Atendimento({ onBackToMenu }) {
  const [pacientes, setPacientes] = useState([]);

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
      return priorityA - priorityB;
    });
  };

  // Função para carregar e atualizar o estado dos pacientes
  const loadAndSetPatients = () => {
    const loadedPatients = carregarPacientes();
    setPacientes(loadedPatients);
  };

  // Efeito para carregar os pacientes quando o componente é montado
  useEffect(() => {
    loadAndSetPatients();
  }, []); // O array vazio garante que o efeito rode apenas uma vez na montagem

  // Função para atualizar um paciente específico
  const updatePaciente = (pacienteFicha, newData) => {
    let currentPacientes = carregarPacientes();
    const pacienteIndex = currentPacientes.findIndex(p => p.ficha === pacienteFicha);

    if (pacienteIndex !== -1) {
      const updatedPacientes = currentPacientes.map((p, index) =>
        index === pacienteIndex ? { ...p, ...newData } : p
      );
      salvarPacientes(updatedPacientes);
      loadAndSetPatients(); // Recarrega e atualiza o estado
    }
  };

  // Inicia o atendimento de um paciente
  const handleStartAttendance = (pacienteFicha) => {
    const currentPatientInAttendance = pacientes.find(p => p.status === 'em_atendimento');

    if (currentPatientInAttendance) {
      alert(`O paciente ${currentPatientInAttendance.nome} já está em atendimento. Por favor, conclua o atendimento atual antes de iniciar um novo.`);
      return;
    }

    updatePaciente(pacienteFicha, { status: 'em_atendimento', calledTime: new Date().toLocaleString() });
    alert(`Atendimento do paciente ${pacienteFicha} iniciado.`);
  };

  // Conclui o atendimento de um paciente
  const handleConcluirAttendance = (pacienteFicha) => {
    updatePaciente(pacienteFicha, { status: 'atendido', conclusionTime: new Date().toLocaleString() });
    alert(`Atendimento do paciente ${pacienteFicha} concluído.`);
  };

  // Lógica para o botão "Sugerir Próximo Paciente"
  const handleSuggestNextPatient = () => {
    const currentPatientInAttendance = pacientes.find(p => p.status === 'em_atendimento');

    if (currentPatientInAttendance) {
      alert(`O paciente ${currentPatientInAttendance.nome} já está em atendimento. Por favor, conclua o atendimento atual antes de sugerir um novo.`);
      return;
    }

    // Filtra pacientes que estão aguardando médico
    const aguardandoMedico = pacientes.filter(p => p.status === 'aguardando_medico');
    const sortedAguardandoMedico = sortPacientesByPriority(aguardandoMedico);

    if (sortedAguardandoMedico.length === 0) {
      alert('Não há mais pacientes aguardando na fila para sugerir.');
      return;
    }

    const nextPaciente = sortedAguardandoMedico[0];
    // Ao sugerir, já mudamos o status para 'em_atendimento' para que ele apareça no Display
    updatePaciente(nextPaciente.ficha, { status: 'em_atendimento', calledTime: new Date().toLocaleString() });
    alert(`Chamando ${nextPaciente.nome} (Ficha: ${nextPaciente.ficha}) para o atendimento.`);
  };

  // Renderiza a fila de pacientes (aguardando médico e em atendimento)
  const renderPatientQueue = () => {
    const queuePacientes = pacientes.filter(p => p.status === 'aguardando_medico' || p.status === 'em_atendimento');
    const sortedQueue = sortPacientesByPriority(queuePacientes);

    if (sortedQueue.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="empty-state">Nenhum paciente aguardando atendimento.</td>
        </tr>
      );
    }

    const hasPatientInAttendance = pacientes.some(p => p.status === 'em_atendimento');

    return sortedQueue.map(paciente => {
      const isBeingAttended = paciente.status === 'em_atendimento';
      return (
        <tr key={paciente.ficha}>
          <td data-label="Ficha">{paciente.ficha || 'N/A'}</td>
          <td data-label="Nome">{paciente.nome}</td>
          <td data-label="Idade">{paciente.idade}</td>
          <td data-label="Prioridade">
            <span className={`priority-tag ${paciente.prioridade}`}>{paciente.prioridade.replace('-', ' ')}</span>
          </td>
          <td data-label="Status">
            <span className={`status-tag ${paciente.status}`}>{paciente.status.replace('_', ' ')}</span>
          </td>
          <td data-label="Ações" className="action-buttons">
            {!isBeingAttended && !hasPatientInAttendance ? (
              <button onClick={() => handleStartAttendance(paciente.ficha)}>Iniciar Atendimento</button>
            ) : null}
            {isBeingAttended ? (
              <button className="btn-danger" onClick={() => handleConcluirAttendance(paciente.ficha)}>Concluir Atendimento</button>
            ) : null}
          </td>
        </tr>
      );
    });
  };

  // Renderiza o histórico de pacientes atendidos
  const renderAttendedHistory = () => {
    const attendedPacientes = pacientes.filter(p => p.status === 'atendido');
    attendedPacientes.sort((a, b) => new Date(b.conclusionTime) - new Date(a.conclusionTime));

    if (attendedPacientes.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="empty-state">Nenhum atendimento concluído ainda.</td>
        </tr>
      );
    }

    return attendedPacientes.map(paciente => (
      <tr key={paciente.ficha}>
        <td data-label="Ficha">{paciente.ficha || 'N/A'}</td>
        <td data-label="Nome">{paciente.nome}</td>
        <td data-label="Prioridade">
          <span className={`priority-tag ${paciente.prioridade}`}>{paciente.prioridade.replace('-', ' ')}</span>
        </td>
        <td data-label="Motivo">{paciente.motivo || 'Não informado'}</td>
        <td data-label="Conclusão">{paciente.conclusionTime || 'N/A'}</td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <button onClick={onBackToMenu} className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
        Voltar ao Menu
      </button>

      <h1>Atendimento Médico</h1>

      <h2>Fila de Atendimento</h2>
      <div className="queue-controls">
        <button onClick={handleSuggestNextPatient} disabled={pacientes.some(p => p.status === 'em_atendimento')}>
          Sugerir Próximo Paciente
        </button>
      </div>
      <table className="patient-table">
        <thead>
          <tr>
            <th>Ficha</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Prioridade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {renderPatientQueue()}
        </tbody>
      </table>

      <h2>Histórico de Atendimentos</h2>
      <table className="patient-table">
        <thead>
          <tr>
            <th>Ficha</th>
            <th>Nome</th>
            <th>Prioridade</th>
            <th>Motivo</th>
            <th>Conclusão</th>
          </tr>
        </thead>
        <tbody>
          {renderAttendedHistory()}
        </tbody>
      </table>
    </div>
  );
}

export default Atendimento;
