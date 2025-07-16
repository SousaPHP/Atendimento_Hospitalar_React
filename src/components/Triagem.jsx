import React, { useState, useEffect } from 'react';
import { salvarPacientes, carregarPacientes, sortPacientesByPriority } from '../utils/localStorage';
import './Triagem.css';

function Triagem() {

  const [pacientes, setPacientes] = useState([]);
  const [pacienteEmTriagem, setPacienteEmTriagem] = useState(null);

  const atualizarPacientes = () => {
    const pacienteInfo = carregarPacientes();
    setPacientes(pacienteInfo);

    const currentTriagePatient = pacienteInfo.find(p => p.status === 'em_triagem');
    setPacienteEmTriagem(currentTriagePatient);
  };

  useEffect(() => {
    atualizarPacientes();
  }, []); 

  const atualizarPriorPaciente = (pacienteFicha, newData) => {
    let pacientes = atualizarPacientes();
    const pacienteIndex = pacientes.findIndex(p => p.ficha === pacienteFicha);

    if (pacienteIndex !== -1) {
            const updatedPacientes = pacientes.map((p, index) =>
        index === pacienteIndex ? { ...p, ...newData } : p
      );
      salvarPacientes(updatedPacientes);
      atualizarPacientes();
    }
  };

  const chamarProximoPaciente = () => {
    if (pacienteEmTriagem) {
      alert(`O paciente ${pacienteEmTriagem.nome} já está em triagem. Por favor, conclua a triagem atual antes de chamar o próximo.`);
      return;
    }

    const aguardandoTriagem = pacientes.filter(p => p.status === 'aguardando_triagem');
    const sortedAguardandoTriagem = sortPacientesByPriority(aguardandoTriagem);

    if (sortedAguardandoTriagem.length === 0) {
      alert('Não há pacientes aguardando triagem.');
      return;
    }

    const nextPaciente = sortedAguardandoTriagem[0];
    atualizarPriorPaciente(nextPaciente.ficha, { status: 'em_triagem' }); // Muda o status para 'em_triagem'
    alert(`Chamando ${nextPaciente.nome} (Ficha: ${nextPaciente.ficha}) para a triagem.`);
  };

  const encaminharConsultorio = (pacienteFicha) => {
    atualizarPriorPaciente(pacienteFicha, { status: 'aguardando_medico' });
    alert(`Paciente ${pacienteFicha} encaminhado para atendimento médico.`);
  };

  const concluirTriagemPrincipal = (pacienteFicha) => {
    atualizarPriorPaciente(pacienteFicha, { status: 'aguardando_medico' });
    alert(`Triagem do paciente ${pacienteFicha} concluída. Encaminhado para atendimento médico.`);
  };

  const tabelaTriagem = () => {
    const aguardandoTriagemPacientes = pacientes.filter(p => p.status === 'aguardando_triagem');
    const sortedPacientes = sortPacientesByPriority(aguardandoTriagemPacientes);

    if (sortedPacientes.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="empty-state">Nenhum paciente cadastrado para triagem.</td>
        </tr>
      );
    }

    return sortedPacientes.map(paciente => (
      <tr key={paciente.ficha} data-patient-ficha={paciente.ficha}>
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
          <select
            className="priority-select"
            value={paciente.prioridade}
            onChange={(e) => atualizarPriorPaciente(paciente.ficha, { prioridade: e.target.value })}
          >
            <option value="emergencia">Emergência</option>
            <option value="muito-urgente">Muito Urgente</option>
            <option value="urgente">Urgente</option>
            <option value="pouco-urgente">Pouco Urgente</option>
            <option value="nao-urgente">Não Urgente</option>
          </select>
          <button onClick={() => encaminharConsultorio(paciente.ficha)} style={{ marginLeft: '10px' }}>
            Encaminhar Consultório
          </button>
        </td>
      </tr>
    ));
  };












  return (
    <div className="container">
      <a href="/" className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
        </svg>
        Voltar ao Menu
      </a>

      <h1>Triagem de Pacientes</h1>

      <div className="controls">
        <button onClick={chamarProximoPaciente} disabled={!!pacienteEmTriagem}>
          Chamar Próximo para Triagem
        </button>
      </div>

      {pacienteEmTriagem ? (
        <div id="patientInTriageBox" className="patient-in-triage-box">
          <div className="info">
            <strong>Paciente em triagem: <span id="currentPatientNameDisplay">{pacienteEmTriagem.nome}</span></strong>
            <span>Ficha: <span id="currentPatientFichaDisplay">{pacienteEmTriagem.ficha}</span></span>
            <br />
            <span>Prioridade:
              <select
                id="triagePatientPrioritySelect"
                className="priority-select"
                value={pacienteEmTriagem.prioridade}
                onChange={(e) => atualizarPriorPaciente(pacienteEmTriagem.ficha, { prioridade: e.target.value })}
              >
                <option value="emergencia">Emergência</option>
                <option value="muito-urgente">Muito Urgente</option>
                <option value="urgente">Urgente</option>
                <option value="pouco-urgente">Pouco Urgente</option>
                <option value="nao-urgente">Não Urgente</option>
              </select>
            </span>
          </div>
          <button onClick={() => concluirTriagemPrincipal(pacienteEmTriagem.ficha)} className="btn-red">
            Concluir Triagem
          </button>
        </div>
      ) : (
        <div id="patientInTriageBox" className="patient-in-triage-box" style={{ display: 'none' }}>

        </div>
      )}


      <table className="patient-list">
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
          {tabelaTriagem()}
        </tbody>
      </table>

    </div>
  );
}

export default Triagem;
