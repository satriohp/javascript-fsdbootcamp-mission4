let todos = []

const todoContainer = document.getElementById("todoContainer");
const priorityColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-500"
};

function renderTodos() {
    todoContainer.innerHTML = "";
    const now = new Date();

    todos.forEach((todo, index) => {
        const item = document.createElement("div");
        item.className = "flex justify-between items-center bg-gray-700 p-3 rounded";
        
        const left = document.createElement("div");
        left.className = "flex items-center gap-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.className = "accent-blue-500 w-4 h-4";
        checkbox.onchange = () => {
            todo.done = checkbox.checked;
            renderTodos();
        };

        const text = document.createElement("span");
        text.textContent = `${todo.desc} [${todo.priority}] - ${todo.date}`;
        text.className = todo.done ? "line-through text-gray-400" : `text-gray-200 ${priorityColors[todo.priority]}`;
    
        const created = new Date(todo.timestamp);
        const diff = (now - created) / (1000 * 60 * 60 * 24); 
        const isOverdue = diff > 1 && !todo.done;
        if (isOverdue) {
          text.classList.add("text-red-400", "font-semibold");
          text.textContent += " (Overdue!)";
        }

        left.appendChild(checkbox);
        left.appendChild(text);

        const btnGroup = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "text-yellow-400 hover:text-yellow-500 mr-3 font-semibold";
        editBtn.onclick = () => {
          const newText = prompt("Edit todo:", todo.desc);
          if (newText && newText.trim() !== "") {
            todo.desc = newText.trim();
            renderTodos();
          }
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "text-red-400 hover:text-red-600 font-semibold";
        delBtn.onclick = () => {
          todos.splice(index, 1);
          renderTodos();
        };

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(delBtn);

        item.appendChild(left);
        item.appendChild(btnGroup);
        todoContainer.appendChild(item);

    });   
}
addBtn.addEventListener("click", () => {
  const desc = todoInput.value.trim();
  const priority = prioritySelect.value;
  if (desc === "") return;

  const now = new Date();
  const formattedDate = now.toLocaleString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  todos.push({
    desc,
    priority,
    done: false,
    date: formattedDate,
    timestamp: now
  });

  todoInput.value = "";
  renderTodos();
  todoInput.focus();
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});

deleteAllBtn.addEventListener("click", () => {
  if (todos.length === 0) return alert("Tidak ada todo untuk dihapus!");
  if (confirm("Yakin mau hapus semua todo?")) {
    todos = [];
    renderTodos();
  }
});

renderTodos();