//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.
// --- Seletores do DOM
const inputAmigo = document.getElementById('amigo');
const listaAmigos = document.getElementById('listaAmigos');
const resultado = document.getElementById('resultado');

// --- Estado: array de nomes (persistido em localStorage)
let amigos = JSON.parse(localStorage.getItem('amigos')) || [];

// --- Função: salvar no localStorage
function salvarAmigos() {
  localStorage.setItem('amigos', JSON.stringify(amigos));
}

// --- Função: renderizar a lista de amigos na tela
function renderLista() {
  listaAmigos.innerHTML = ''; // limpa
  if (amigos.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhum nome adicionado ainda.';
    li.className = 'empty';
    listaAmigos.appendChild(li);
    return;
  }

  amigos.forEach((nome, index) => {
    const li = document.createElement('li');
    li.className = 'name-item';
    li.setAttribute('role', 'listitem');

    const span = document.createElement('span');
    span.textContent = nome;
    span.className = 'name-text';

    // Botão remover (acessível)
    const btnRemover = document.createElement('button');
    btnRemover.className = 'remove-btn';
    btnRemover.title = `Remover ${nome}`;
    btnRemover.setAttribute('aria-label', `Remover ${nome}`);
    btnRemover.textContent = '✖';
    btnRemover.addEventListener('click', () => removerAmigo(index));

    li.appendChild(span);
    li.appendChild(btnRemover);
    listaAmigos.appendChild(li);
  });
}

// --- Função: adicionar amigo
function adicionarAmigo() {
  const nome = inputAmigo.value.trim();

  if (!nome) {
    alert('Por favor, digite um nome válido.');
    inputAmigo.focus();
    return;
  }

  if (amigos.includes(nome)) {
    alert('Este nome já está na lista.');
    inputAmigo.value = '';
    inputAmigo.focus();
    return;
  }

  amigos.push(nome);
  salvarAmigos();
  renderLista();

  inputAmigo.value = '';
  inputAmigo.focus();
}

// --- Função: remover amigo por índice
function removerAmigo(index) {
  amigos.splice(index, 1);
  salvarAmigos();
  renderLista();
}

// --- Função: sortear um amigo aleatoriamente e removê-lo da lista
function sortearAmigo() {
  resultado.innerHTML = ''; // limpa resultado anterior

  if (amigos.length === 0) {
    alert('Adicione pelo menos um nome antes de sortear.');
    inputAmigo.focus();
    return;
  }

  const duracao = 1200; // ms
  const intervalo = 80; // ms
  const passos = Math.floor(duracao / intervalo);
  let i = 0;

  const display = document.createElement('li');
  display.className = 'result-item';
  display.setAttribute('aria-live', 'polite');
  resultado.appendChild(display);

  const timer = setInterval(() => {
    const candidato = amigos[Math.floor(Math.random() * amigos.length)];
    display.textContent = `Sorteando... ${candidato}`;
    i++;
    if (i >= passos) {
      clearInterval(timer);

      // Escolha final
      const indiceEscolhido = Math.floor(Math.random() * amigos.length);
      const escolhido = amigos[indiceEscolhido];

      display.innerHTML = `🎉 <strong>Amigo sorteado:</strong> ${escolhido}`;
      display.tabIndex = -1;
      display.focus();

      // --- Remover da lista e atualizar
      amigos.splice(indiceEscolhido, 1);
      salvarAmigos();
      renderLista();

      // --- NOVO: verificar se acabou a lista
      if (amigos.length === 0) {
        const msgFinal = document.createElement('li');
        msgFinal.className = 'result-item final-message';
        msgFinal.innerHTML = `🥳 <strong>Todos os amigos foram sorteados!</strong>`;
        resultado.appendChild(msgFinal);
      }
    }
  }, intervalo);
}


// --- Ativar Enter para adicionar
inputAmigo.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    adicionarAmigo();
  }
});

// --- Inicializar lista na carga da página
document.addEventListener('DOMContentLoaded', () => {
  renderLista();
});
