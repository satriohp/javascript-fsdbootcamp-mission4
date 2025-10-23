const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const todoContainer = document.getElementById("todoContainer");
const completedContainer = document.createElement("tbody");
const prioritySelect = document.getElementById("prioritySelect");
const sortContainer = document.createElement("div");
const profileImg = document.getElementById("profileLink");


profileImg.addEventListener("click", () => {
  const name = document.getElementById("username").textContent;
  const role = document.getElementById("userRole").textContent;
  const photo = profileImg.querySelector("img").src;
  const regNumber = "REG-" + Math.floor(Math.random() * 1000000);

  localStorage.setItem("userProfile", JSON.stringify({ name, role, photo, regNumber }));
  window.location.href = "profilePage.html";
});

sortContainer.className = "flex justify-end mb-2";
sortContainer.innerHTML = `
  <select id="sortSelect" class="p-2 rounded bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
    <option value="newest">Sort by Newest</option>
    <option value="oldest">Sort by Oldest</option>
    <option value="priority-high">Sort by High Priority</option>
    <option value="priority-low">Sort by Low Priority</option>
  </select>
`;
document.querySelector("table").insertAdjacentElement("beforebegin", sortContainer);
const sortSelect = document.getElementById("sortSelect");

const completedSection = document.createElement("div");
completedSection.className = "overflow-x-auto rounded-lg mt-8";
completedSection.innerHTML = `
  <h2 class="text-xl font-bold mb-3 text-green-400">Done</h2>
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-gray-700 text-gray-300">
        <th class="px-4 py-2">#</th>
        <th class="px-4 py-2">Todo</th>
        <th class="px-4 py-2">Priority</th>
        <th class="px-4 py-2">Created</th>
        <th class="px-4 py-2 text-center">Actions</th>
      </tr>
    </thead>
  </table>
`;
completedSection.querySelector("table").appendChild(completedContainer);
document.querySelector("main .bg-gray-800").appendChild(completedSection);

let todos = [];

function renderTodos() {
  todoContainer.innerHTML = "";
  completedContainer.innerHTML = "";
  const now = new Date();

  const sortedTodos = [...todos];
  if (sortSelect.value === "oldest") {
    sortedTodos.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (sortSelect.value === "newest") {
    sortedTodos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortSelect.value === "priority-high") {
    const order = { high: 1, medium: 2, low: 3 };
    sortedTodos.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortSelect.value === "priority-low") {
    const order = { high: 3, medium: 2, low: 1 };
    sortedTodos.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  sortedTodos.forEach((todo, index) => {
    const row = document.createElement("tr");
    row.className =
      "hover:bg-gray-700/40 transition duration-200 border-b border-gray-800";

    const idxCell = document.createElement("td");
    idxCell.className = "px-4 py-2 text-gray-400 text-center";
    idxCell.textContent = index + 1;

    const todoCell = document.createElement("td");
    todoCell.className = "px-4 py-2 align-middle";
    const wrapper = document.createElement("div");
    wrapper.className = "inline-flex items-center gap-2";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.className = "accent-blue-500 w-4 h-4";
    checkbox.onchange = () => {
      todo.done = checkbox.checked;
      renderTodos();
    };

    const text = document.createElement("span");
    text.textContent = todo.desc;
    text.className = todo.done
      ? "line-through text-gray-500"
      : "text-gray-200";

    const created = new Date(todo.timestamp);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    const isOverdue = diffDays > 1 && !todo.done;
    if (isOverdue) {
      const overdueTag = document.createElement("span");
      overdueTag.textContent = " (Overdue!)";
      overdueTag.className = "text-red-400 font-semibold ml-1";
      text.appendChild(overdueTag);
    }

    wrapper.appendChild(checkbox);
    wrapper.appendChild(text);
    todoCell.appendChild(wrapper);

    const priorityCell = document.createElement("td");
    priorityCell.className =
      "px-4 py-2 font-semibold capitalize " +
      (todo.priority === "high"
        ? "text-red-400"
        : todo.priority === "medium"
        ? "text-yellow-400"
        : "text-green-400");
    priorityCell.textContent = todo.priority;

    const dateCell = document.createElement("td");
    dateCell.className = "px-4 py-2 text-gray-400 text-sm whitespace-nowrap";
    dateCell.textContent = todo.date;

    const actionsCell = document.createElement("td");
    actionsCell.className = "px-4 py-2 text-center";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className =
      "text-yellow-400 hover:text-yellow-500 font-semibold mx-2";
    editBtn.onclick = () => {
      const newText = prompt("Edit todo:", todo.desc);
      if (newText && newText.trim() !== "") {
        todo.desc = newText.trim();
        renderTodos();
      }
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className =
      "text-red-400 hover:text-red-500 font-semibold mx-2";
    delBtn.onclick = () => {
      todos.splice(todos.indexOf(todo), 1);
      renderTodos();
    };

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(delBtn);

    row.appendChild(idxCell);
    row.appendChild(todoCell);
    row.appendChild(priorityCell);
    row.appendChild(dateCell);
    row.appendChild(actionsCell);

    if (todo.done) {
      completedContainer.appendChild(row);
    } else {
      todoContainer.appendChild(row);
    }
  });
}

addBtn.addEventListener("click", () => {
  const desc = todoInput.value.trim();
  const priority = prioritySelect.value;
  if (desc === "") return alert("Isi dulu todonya, bro!");

  const now = new Date();
  const formattedDate = now.toLocaleString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  todos.push({
    desc,
    priority,
    done: false,
    date: formattedDate,
    timestamp: now,
  });

  todoInput.value = "";
  renderTodos();
});

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addBtn.click();
});

deleteAllBtn.addEventListener("click", () => {
  if (todos.length === 0) return alert("Belum ada todo yang bisa dihapus!");
  if (confirm("Yakin mau hapus semua todo?")) {
    todos = [];
    renderTodos();
  }
});

sortSelect.addEventListener("change", renderTodos);

renderTodos();
