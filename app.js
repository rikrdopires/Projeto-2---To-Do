// Seletores do DOM
// ====================

// Elementos com ID
// objetivo: o JS precisa "pegar" e "guardar" os elementos da página para poder 
// manipulá-los (ler valor, mudar texto, adicionar itens).
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('task-counter');
const clearBtn = document.getElementById('clear-completed');

// Elementos com classe
const filterBtns = document.querySelectorAll('.filters_btn');

/* Teste no console (apagar depois)
console.log("Form:", form);
console.log("Input:", input);
console.log("List:", list);
console.log("Counter:", counter);
console.log("ClearBtn:", clearBtn);
console.log("FilterBtns:", filterBtns); 
*/

// Estado + renderização mínima
// ============================================

// criação da array com todas as tarefas
let tasks = [];

// desenha a lista de tarefas na tela
function render() {
    list.innerHTML = ''; // limpa a lista antes de renderizar


    if (tasks.length === 0) {
        const empty = document.createElement('li');
        empty.className = "task-item";
        empty.style.justifyContent = "center";
        empty.style.color = "var(--color-muted)";
        empty.textContent = "Nenhuma tarefa encontrada";
        list.appendChild(empty);
    }

// atualizar contator de tarefas pendentes
    updateCounter();
}


// Contar quantas tarefas NÃO estão concluídas e mostrar no rodapé
function updateCounter() {
    const pendingt = tasks.filter(function (t) {
        return !t.completed;
    }).length;

    // ajustar singular e plural corretamente
    if (pendingt === 1) {
        counter.textContent = "1 tarefa pendente";
    } else {
        counter.textContent = pendingt + " tarefas pendentes";
    }
}

// iniciar tarefa ao carregar a página
render();

// BLOCO — Adicionar tarefa
// ============================================

// criar uma nova tarefa e adicioná-la à lista
function addTask(text) {
    const trimmed = text.trim(); // remove espaços em branco no início e no fim
    if (!trimmed) return; // não adiciona tarefas vazias

    const newTask = {
        id: Date.now(), // gera um ID único baseado no horário atual
        text: trimmed,
        completed: false // toda tarefa nasce não concluída
    };

    tasks.push(newTask); // adiciona a nova tarefa à array
    render(); // atualiza a tela
}

// Escuta o evento de envio do formulário
form.addEventListener('submit', function (e) {
    e.preventDefault(); // impede o carrgamento padrão do form

    addTask(input.value); // adiciona a tarefa com o valor do input
    input.value = ''; // limpa o input
    input.focus(); // coloca o cursor de volta no input
});