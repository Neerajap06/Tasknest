let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " completed" : "");
    li.setAttribute("draggable", "true");
    li.setAttribute("data-index", index);

    li.innerHTML = `
      <span>${task.name} - <em>${task.category}</em></span>
      <button onclick="toggleDone(${index})">✔️</button>
      <button onclick="deleteTask(${index})">🗑️</button>
    `;

    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);

    taskList.appendChild(li);
  });
  updateChart();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("categorySelect").value;

  if (input.value.trim()) {
    tasks.push({ name: input.value.trim(), category, done: false });
    input.value = "";
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

// Drag-and-drop logic
let draggedIndex;

function handleDragStart(e) {
  draggedIndex = +e.currentTarget.getAttribute("data-index");
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  const droppedIndex = +e.currentTarget.getAttribute("data-index");
  const draggedTask = tasks[draggedIndex];
  tasks.splice(draggedIndex, 1);
  tasks.splice(droppedIndex, 0, draggedTask);
  renderTasks();
}

// Dark mode toggle
document.getElementById("toggleMode").onclick = () => {
  document.body.classList.toggle("dark-mode");
};

// Chart.js progress chart
let chart;

function updateChart() {
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;

  const ctx = document.getElementById("progressChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Done", "Pending"],
      datasets: [
        {
          data: [done, total - done],
          backgroundColor: ["#2ecc71", "#e74c3c"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}

renderTasks();
