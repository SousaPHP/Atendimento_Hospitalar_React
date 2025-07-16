import React, { useState, useEffect } from 'react';
import { salvarPacientes, carregarPacientes, sortPacientesByPriority } from '../utils/localStorage';
import './Atendimento.css';

function Atendimento({ onBackToMenu }) {
  const [pacientes, setPacientes] = useState([]);

  const atualizarPacientes = () => {
    const pacienteInfo = carregarPacientes();
    setPacientes(pacienteInfo);
  };

  useEffect(() => {
    atualizarPacientes();
  }, []); 

  const updatePaciente = (pacienteFicha, newData) => {
    let currentPacientes = carregarPacientes();
    const pacienteIndex = currentPacientes.findIndex(p => p.ficha === pacienteFicha);

    if (pacienteIndex !== -1) {
      const updatedPacientes = currentPacientes.map((p, index) =>
        index === pacienteIndex ? { ...p, ...newData } : p
      );
      salvarPacientes(updatedPacientes);
      atualizarPacientes(); 
    }
  };

  const iniciarAtendimento = (pacienteFicha) => {
    const currentPatientInAttendance = pacientes.find(p => p.status === 'em_atendimento');

    if (currentPatientInAttendance) {
      alert(`O paciente ${currentPatientInAttendance.nome} já está em atendimento. Por favor, conclua o atendimento atual antes de iniciar um novo.`);
      return;
    }

    updatePaciente(pacienteFicha, { status: 'em_atendimento', calledTime: new Date().toLocaleString() });
    alert(`Atendimento do paciente ${pacienteFicha} iniciado.`);
  };

  const concluirAtendimento = (pacienteFicha) => {
    updatePaciente(pacienteFicha, { status: 'atendido', conclusionTime: new Date().toLocaleString() });
    alert(`Atendimento do paciente ${pacienteFicha} concluído.`);
    document.getElementById("sugerirProximo").disabled = false;
  };

  const sugerirProximoPaciente = () => {
    const aguardandoMedico = pacientes.filter(p => p.status === 'aguardando_medico');
    const sortedAguardandoMedico = sortPacientesByPriority(aguardandoMedico);

    if (sortedAguardandoMedico.length === 0) {
      alert('Não há mais pacientes aguardando na fila para sugerir.');
      return;
    }
    const nextPaciente = sortedAguardandoMedico[0];
   
    updatePaciente(nextPaciente.ficha, { status: 'em_atendimento', calledTime: new Date().toLocaleString() });
    alert(`Chamando ${nextPaciente.nome} (Ficha: ${nextPaciente.ficha}) para o atendimento.`);
    document.getElementById("sugerirProximo").disabled = true;
  };

 
  const tabelaPacientes = () => {
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
              <button onClick={() => iniciarAtendimento(paciente.ficha)}>Iniciar Atendimento</button>
            ) : null}
            {isBeingAttended ? (
              <button className="btn-danger" onClick={() => concluirAtendimento(paciente.ficha)}>Concluir Atendimento</button>
            ) : null}
          </td>
        </tr>
      );
    });
  };


  const tabelaHistorico = () => {
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
        <button id="sugerirProximo" onClick={sugerirProximoPaciente} disabled={pacientes.some(p => p.status === 'em_atendimento')}>
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
          {tabelaPacientes()}
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
          {tabelaHistorico()}
        </tbody>
      </table>
    </div>
  );
}

export default Atendimento;
