let todos = []

const todoContainer = document.getElementById("todoContainer");
const priorityColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-500"
};

function renderTodos() {
    todoContainer.innerHTML() = "";
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
        text.className = todo.done ? "line-through text-gray-400" : "text-gray-200";
    
        const created = new Date(todo.timestamp);
        const diff = (now - created) / (1000 * 60 * 60 * 24); 
        const isOverdue = diff > 1 && !todo.done;
        if (isOverdue) {
          text.classList.add("text-red-400", "font-semibold");
          text.textContent += " (Overdue!)";
        }

        left.appendChild(checkbox);
        left.appendChild(text);
        item.appendChild(left);
        todoContainer.appendChild(item);

    });   
}

renderTodos();