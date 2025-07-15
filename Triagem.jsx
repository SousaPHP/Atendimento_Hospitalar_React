// src/components/Triagem.jsx
import React, { useState, useEffect } from 'react';
import { salvarPacientes, carregarPacientes } from '../utils/localStorage'; // Importa as funções do localStorage
import './Triagem.css'; // Importa o CSS específico deste componente

function Triagem() {
  // Estado para armazenar a lista de pacientes
  const [pacientes, setPacientes] = useState([]);
  // Estado para armazenar o paciente atualmente em triagem (o que aparece no box superior)
  const [pacienteEmTriagem, setPacienteEmTriagem] = useState(null);

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
    return [...pacientesArray].sort((a, b) => { // Cria uma cópia para não mutar o estado diretamente
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

    // Encontra o paciente que está em triagem para o box superior
    const currentTriagePatient = loadedPatients.find(p => p.status === 'em_triagem');
    setPacienteEmTriagem(currentTriagePatient);
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
      // Cria um novo array com o paciente atualizado para garantir imutabilidade
      const updatedPacientes = currentPacientes.map((p, index) =>
        index === pacienteIndex ? { ...p, ...newData } : p
      );
      salvarPacientes(updatedPacientes);
      loadAndSetPatients(); // Recarrega e atualiza o estado
    }
  };

  // Lógica para o botão "Chamar Próximo para Triagem"
  const handleCallNextPatient = () => {
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
    updatePaciente(nextPaciente.ficha, { status: 'em_triagem' }); // Muda o status para 'em_triagem'
    alert(`Chamando ${nextPaciente.nome} (Ficha: ${nextPaciente.ficha}) para a triagem.`);
  };

  // Função para encaminhar o paciente para o consultório diretamente da linha da tabela
  const handleEncaminharConsultorio = (pacienteFicha) => {
    updatePaciente(pacienteFicha, { status: 'aguardando_medico' });
    alert(`Paciente ${pacienteFicha} encaminhado para atendimento médico.`);
  };

  // Função para concluir a triagem do paciente que está no box superior
  const handleConcluirTriagemPrincipal = (pacienteFicha) => {
    updatePaciente(pacienteFicha, { status: 'aguardando_medico' });
    alert(`Triagem do paciente ${pacienteFicha} concluída. Encaminhado para atendimento médico.`);
  };

  // Renderiza a lista de pacientes aguardando triagem (tabela principal)
  const renderTriageQueueList = () => {
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
            onChange={(e) => updatePaciente(paciente.ficha, { prioridade: e.target.value })}
          >
            <option value="emergencia">Emergência</option>
            <option value="muito-urgente">Muito Urgente</option>
            <option value="urgente">Urgente</option>
            <option value="pouco-urgente">Pouco Urgente</option>
            <option value="nao-urgente">Não Urgente</option>
          </select>
          <button onClick={() => handleEncaminharConsultorio(paciente.ficha)} style={{ marginLeft: '10px' }}>
            Encaminhar Consultório
          </button>
        </td>
      </tr>
    ));
  };

  // Renderiza a lista de pacientes que já passaram pela triagem (tabela inferior)
  const renderMedicoQueueList = () => {
    const aguardandoMedicoPacientes = pacientes.filter(p => p.status === 'aguardando_medico');
    const sortedPacientes = sortPacientesByPriority(aguardandoMedicoPacientes);

    if (sortedPacientes.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="empty-state">Nenhum paciente aguardando atendimento médico.</td>
        </tr>
      );
    }

    return sortedPacientes.map(paciente => (
      <tr key={paciente.ficha}>
        <td data-label="Ficha">{paciente.ficha || 'N/A'}</td>
        <td data-label="Nome">{paciente.nome}</td>
        <td data-label="Prioridade">
          <span className={`priority-tag ${paciente.prioridade}`}>{paciente.prioridade.replace('-', ' ')}</span>
        </td>
        <td data-label="Status">
          <span className={`status-tag ${paciente.status}`}>{paciente.status.replace('_', ' ')}</span>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <a href="/" className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
        Voltar ao Menu
      </a>

      <h1>Triagem de Pacientes</h1>

      <div className="controls">
        <button onClick={handleCallNextPatient} disabled={!!pacienteEmTriagem}>
          Chamar Próximo para Triagem
        </button>
      </div>

      {/* Área para o paciente atualmente em triagem */}
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
                onChange={(e) => updatePaciente(pacienteEmTriagem.ficha, { prioridade: e.target.value })}
              >
                <option value="emergencia">Emergência</option>
                <option value="muito-urgente">Muito Urgente</option>
                <option value="urgente">Urgente</option>
                <option value="pouco-urgente">Pouco Urgente</option>
                <option value="nao-urgente">Não Urgente</option>
              </select>
            </span>
          </div>
          <button onClick={() => handleConcluirTriagemPrincipal(pacienteEmTriagem.ficha)} className="btn-red">
            Concluir Triagem
          </button>
        </div>
      ) : (
        <div id="patientInTriageBox" className="patient-in-triage-box" style={{ display: 'none' }}>
            {/* Este div vazio é para manter a estrutura, mas não será visível */}
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
          {renderTriageQueueList()}
        </tbody>
      </table>

      <h2 style={{ marginTop: '50px' }}>Pacientes Aguardando Atendimento Médico (Após Triagem)</h2>
      <table className="patient-list">
        <thead>
          <tr>
            <th>Ficha</th>
            <th>Nome</th>
            <th>Prioridade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {renderMedicoQueueList()}
        </tbody>
      </table>
    </div>
  );
}

export default Triagem;
