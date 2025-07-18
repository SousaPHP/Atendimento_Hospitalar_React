# 🏥 Sistema de Controle de Atendimento (Triagem Hospitalar)

## 🎯 Objetivo

Este projeto é a entrega do **Projeto Final do Módulo Intermediario**, com o objetivo de simular um sistema de triagem hospitalar desenvolvido em **React** e **JavaScript**gemini
. Todos os dados são persistidos via `localStorage`.

O sistema permite gerenciar o fluxo de pacientes, desde o cadastro até o fim do atendimento, considerando prioridade com base em gravidade, e emissão automática de fichas.

## 🔗 Links do Projeto

Aplicação Online (Vercel): https://atendimento-hospitalar-react.vercel.app/

## 😎 Equipe

 * [Vivian](https://github.com/Vivianx1918) 
 * Daniel Victor de Sousa
 * [Paulo Henrique](https://github.com/SousaPHP)
 
## 🚀 Funcionalidades Chave

Nosso sistema é modular, dividido em componentes React que representam cada etapa do fluxo de atendimento:

* ### **🏠 Menu Principal (`/`)**

  * Sua porta de entrada para todas as funcionalidades do sistema.

  * Design limpo, responsivo e com botões grandes e ícones intuitivos para navegação rápida.

* ### **📝 Cadastro de Pacientes (`/cadastro`)**

  * Um formulário ágil para registrar novos pacientes.

  * Colete informações essenciais: Nome Completo, Idade, Sexo e a Prioridade de Atendimento inicial.

  * Geração automática e sequencial de números de ficha.

  * Cada paciente inicia sua jornada com o status `aguardando_triagem`.

* ### **📝 Triagem de Pacientes (`/triagem`)**

  * **Visão Geral da Fila**: Monitore pacientes com status `aguardando_triagem`.

  * **Chamada Dinâmica**: Utilize "Chamar Próximo para Triagem" para destacar o paciente de maior prioridade em uma área exclusiva, removendo-o da lista principal. Este paciente será imediatamente visível no Display para a sala de espera!

  * **Ajuste de Prioridade**: Reclassifique a prioridade do paciente em triagem em tempo real.

  * **Conclusão da Triagem**: Com um clique em "Concluir Triagem", o paciente é movido para a fila de atendimento médico (`aguardando_medico`).

  * **Encaminhamento Rápido**: Opção "Encaminhar Consultório" para mover pacientes diretamente da lista de espera para a fila médica, pulando a etapa de triagem se necessário.

  * **Fila Médica Pós-Triagem**: Uma seção dedicada exibe pacientes que já concluíram a triagem e agora estão `aguardando_medico`.

* ### **🩺 Atendimento Médico (`/atendimento`)**

  * **Fila Organizada**: Visualize pacientes `aguardando_medico` e `em_atendimento`, sempre ordenados por prioridade.

  * **Sugerir Próximo**: O botão "Sugerir Próximo Paciente" não apenas indica o próximo da fila, mas já o move para `em_atendimento`, atualizando o Display para a sala de espera.

  * **Controle Total**: Inicie ou conclua atendimentos com facilidade. Apenas um paciente pode estar `em_atendimento` por vez.

  * **Histórico Completo**: Acesse um registro detalhado de todos os pacientes `atendido`s, incluindo motivo da visita e hora de conclusão.

* ### **📺 Display de Atendimento (`/display`)**

  * A tela perfeita para a sala de espera, projetada para visibilidade em telas grandes.

  * **Destaque Principal**: Exibe o paciente atualmente `em_atendimento` (no consultório médico) ou `em_triagem` (no guichê de triagem), com indicação clara do local.

  * **Próximos na Fila**: Uma lista dinâmica dos próximos pacientes `aguardando_triagem` ou `aguardando_medico`, mantendo todos informados.

  * **Atualização em Tempo Real**: Os dados são sincronizados automaticamente a cada 3 segundos.

* ### **⚙️ Gerenciamento de Pacientes (`/gerenciamento`)**

  * Sua central de controle para supervisão e ajustes.

  * **Visão Abrangente**: Visualize **todos** os pacientes do sistema, independentemente do status.

  * **Flexibilidade de Status**: Altere o status de qualquer paciente manualmente (ideal para correções ou cenários especiais).

  * **Exclusão Direta**: Remova registros de pacientes de forma instantânea.

## 📦 Estrutura do Projeto

- `App.jsx` — Componete Principal, atua como uma tela de menu
- `App.css` — Estilo global do aplicativo

### components/
- `Atendimento.jsx` — Componente da tela de atendimento médico
- `Atendimento.css` — Estilização da tela de atendimento
- `Cadastro.jsx` — Componente para cadastro de pacientes
- `Cadastro.css` — Estilização da tela de cadastro
- `Display.jsx` — Componente do painel público de chamadas
- `Display.css` — Estilização da tela de exibição pública
- `Triagem.jsx` — Componente para triagem de pacientes
- `Triagem.css` — Estilização da tela de triagem

### utils/
- `localStorage.js` — Funções auxiliares para salvar, carregar e ordenar pacientes no localStorage

## 🛠️ Tecnologias Utilizadas

Este projeto é construído com as seguintes ferramentas e tecnologias modernas:

* [**React.js**](https://react.dev/): A biblioteca JavaScript líder para construção de interfaces de usuário dinâmicas e reativas.

* [**Vite**](https://vitejs.dev/): Um bundler de próxima geração que proporciona um ambiente de desenvolvimento incrivelmente rápido.

* **JavaScript (ES6+)**: A linguagem que dá vida à toda a lógica frontend.

* **HTML5**: A espinha dorsal estrutural de nossas páginas.

* **CSS3**: Para um design limpo, responsivo e visualmente agradável.

* **LocalStorage**: Para uma persistência de dados simples e eficiente diretamente no navegador.
