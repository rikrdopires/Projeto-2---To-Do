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

// Bloco 2 — Estado + renderização mínima
// ============================================

// criação da array com todas as tarefas
let tasks = [];

let currentFilter = "all"; //all, active, completed


// Devolve só as tarefas que devem aparecer com o filtro atual
function getVisibleTasks() {
    if (currentFilter === "active")
        return tasks.filter(t => !t.completed);
    if (currentFilter === "completed")
        return tasks.filter(t => t.completed);
    return tasks;
}

function getEmptyMessage() {
    if (currentFilter === "active")
        return "Nenhuma tarefa ativa.";
    if (currentFilter === "completed")
        return "Nenhuma tarefa concluída ainda.";
    return "Nenhuma tarefa por aqui.";
}

// desenha a lista de tarefas na tela
function render() {
    list.innerHTML = ''; // limpa a lista antes de renderizar

    const visible = getVisibleTasks();


    if (visible.length === 0) {
        const empty = document.createElement('li');
        empty.className = "task-item";
        empty.style.justifyContent = "center";
        empty.style.color = "var(--color-muted)";
        empty.textContent = getEmptyMessage();
        list.appendChild(empty);
    } else {
        // Loop: cria um <li> pra cada tarefa do array
        visible.forEach(function (task) {
            list.appendChild(createTaskElement(task));
        });
    }

// atualizar contator de tarefas pendentes
    updateCounter();
}


// Contar quantas tarefas NÃO estão concluídas e mostrar no rodapé
function updateCounter() {
    const pending = tasks.filter(function (t) {
        return !t.completed;
    }).length;

    // ajustar singular e plural corretamente
    if (pending === 1) {
        counter.textContent = "1 tarefa pendente";
    } else {
        counter.textContent = pending + " tarefas pendentes";
    }
}


// BLOCO 3 — Adicionar tarefa
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
form.addEventListener("submit", function (e) {
    e.preventDefault(); // impede o carregamento padrão do form

    addTask(input.value); // adiciona a tarefa com o valor do input
    input.value = ""; // limpa o input
    input.focus(); // coloca o cursor de volta no input
});

// executar o clique do botão de filtro e chama a função setFilter
filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
        setFilter(btn.dataset.filter);
    });
});


// BLOCO 4 — Cria e devolve um <li> completo com checkbox, texto e botão de deletar
// ============================================

// receber um objeto de tarefa
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("is-completed");
    }

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-item_checkbox";
    checkbox.checked = task.completed;

    // Texto
    const span = document.createElement("span");
    span.className = "task-item_text";
    span.textContent = task.text;

    // botão de deletar
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "task-item_delete";
    deleteBtn.textContent = "🗑️";

    //listener para o checkbox: alterar o estado
    checkbox.addEventListener("change", function () {
        toggleTask(task.id);
    });
    
    // Listener do botão de deletar: remove a tarefa
    deleteBtn.addEventListener("click", function () {
        deleteTask(task.id);
    });
 

    // montar o <li>
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);


    return li;
}

// Filtar tarefas e acionar o botão roxo
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(function (btn) {
        btn.classList.toggle("is-active", btn.dataset.filter === filter);
    });
    render();
}

// BLOCO 5 — Alternar concluída + Deletar
// ============================================

// Alterna o estado "completed" da tarefa com o id dado.
function toggleTask(id) {
    const task = tasks.find(function (t) {
        return t.id === id;      // procura a tarefa com esse id
    });
    if (!task) return;         // segurança: se não achar, sai

    task.completed = !task.completed;  // inverte o estado
    render();                  // atualiza a tela
}

// Remove a tarefa com o id dado do array.
function deleteTask(id) {
    tasks = tasks.filter(function (t) {
        return t.id !== id;     // mantém todas as tarefas que NÃO têm esse id
    });
    render();                  // atualiza a tela
}

// iniciar tarefa ao carregar a página
render();