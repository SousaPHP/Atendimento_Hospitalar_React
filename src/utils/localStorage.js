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
