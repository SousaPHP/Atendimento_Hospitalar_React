// src/components/Display.jsx
import React, { useState, useEffect } from 'react';
import { carregarPacientes, sortPacientesByPriority } from '../utils/localStorage';
import './Display.css'; // Importa o CSS específico deste componente

function Display() {
  const [pacientes, setPacientes] = useState([]);
  const [currentPatientDisplay, setCurrentPatientDisplay] = useState(null);
  const [nextPatientsList, setNextPatientsList] = useState([]);

  const display = () => {
    const loadedPatients = carregarPacientes();
    setPacientes(loadedPatients); 

    let currentPatient = null;
    let currentPatientLoc = '';

    currentPatient = loadedPatients.find(p => p.status === 'em_atendimento');
    if (currentPatient) {
      currentPatientLoc = 'Consultório Médico';
    } else {
      currentPatient = loadedPatients.find(p => p.status === 'em_triagem');
      if (currentPatient) {
        currentPatientLoc = 'Guichê de Triagem';
      }
    }

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

    setNextPatientsList(finalNextPatients.slice(0, 5));
  };

  useEffect(() => {
    display(); 
    const intervalId = setInterval(display, 3000); 

    return () => clearInterval(intervalId);
  }, []); 









  return (
    <div className="display-wrapper">
      <a href="/" className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
        Menu
      </a>

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
