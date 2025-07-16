// src/utils/localStorage.js

// Para salvar o paciente localStorage
export function salvarPacientes(pacientes) {
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

// Para carregar
export function carregarPacientes() {
  let dados = localStorage.getItem('pacientes');
  if (dados) {
    return JSON.parse(dados);
  } else {
    return [];
  }
}

// Para gerar numero da ficha
export function gerarFicha() {
  let numero = localStorage.getItem('contadorFicha');

  if (numero == null) {
    numero = 1;
  } else {
    numero = parseInt(numero) + 1;
  }

  localStorage.setItem('contadorFicha', numero);

  return 'F' + numero;
}

//Ordena pacientes por prioridade
export function sortPacientesByPriority(pacientesArray) {
  const prioridade = {
    'emergencia': 1,
    'muito-urgente': 2,
    'urgente': 3,
    'pouco-urgente': 4,
    'nao-urgente': 5
  };

  return [...pacientesArray].sort(function (a, b) {
    const prioridadeA = prioridade[a.prioridade] || 99;
    const prioridadeB = prioridade[b.prioridade] || 99;

    if (prioridadeA === prioridadeB) {
      const fichaA = parseInt(a.ficha.replace('F', ''));
      const fichaB = parseInt(b.ficha.replace('F', ''));
      return fichaA - fichaB;
    }

    return prioridadeA - prioridadeB;
  });
}