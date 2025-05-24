const form = document.querySelector("form");
const input = document.querySelector("input");
const list = document.querySelector("ul");
const darkModeToggle = document.getElementById("darkModeToggle");
const filters = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load tasks on page load
tasks.forEach(task => addTaskToDOM(task.text, task.completed));

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  tasks.push(task);
  saveTasks();
  addTaskToDOM(task.text, task.completed);
  input.value = "";
});

function addTaskToDOM(text, completed) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = text;
  li.appendChild(span);

  if (completed) li.classList.add("completed");

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");
  li.appendChild(deleteBtn);
  list.appendChild(li);

  // Toggle completion
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    const index = Array.from(list.children).indexOf(li);
    tasks[index].completed = li.classList.contains("completed");
    saveTasks();
  });

  // Delete task
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent toggling complete on delete
    const index = Array.from(list.children).indexOf(li);
    tasks.splice(index, 1);
    saveTasks();
    li.classList.add("fade-out");
    setTimeout(() => {
    list.removeChild(li);
    },
    400); // Matches the fade-out duration

  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter buttons
filters.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    Array.from(list.children).forEach((li, index) => {
      const isCompleted = tasks[index].completed;

      if (filter === "all") {
        li.style.display = "flex";
      } else if (filter === "active") {
        li.style.display = isCompleted ? "none" : "flex";
      } else if (filter === "completed") {
        li.style.display = isCompleted ? "flex" : "none";
      }
    });
  });
});

// Dark Mode toggle
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
});

const clearAllBtn = document.getElementById("clearAll");

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    list.innerHTML = ""; // clear the DOM
  }
});

// Enable editing on double-click
span.addEventListener("dblclick", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "edit-input";
  li.replaceChild(input, span);
  input.focus();

  // Save on blur or Enter key
  function saveEdit() {
    const newText = input.value.trim();
    if (newText) {
      span.textContent = newText;
      tasks[index].text = newText;
      saveTasks();
    }
    li.replaceChild(span, input);
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  });
});

function addTaskToDOM(text, completed, dueDate) {
  const li = document.createElement("li");
  li.textContent = text;

  if (completed) li.classList.add("completed");

  // Add due date span
  if (dueDate) {
    const dateSpan = document.createElement("span");
    dateSpan.textContent = ` (Due: ${dueDate})`;
    dateSpan.classList.add("due-date");
    li.appendChild(dateSpan);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");
  li.appendChild(deleteBtn);
  list.appendChild(li);

  // Toggle completion
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    const index = Array.from(list.children).indexOf(li);
    tasks[index].completed = li.classList.contains("completed");
    saveTasks();
  });

  // Delete task with fade animation
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = Array.from(list.children).indexOf(li);
    tasks.splice(index, 1);
    saveTasks();
    li.classList.add("fade-out");
    setTimeout(() => list.removeChild(li), 400);
  });
}

function addTaskToDOM(text, completed, dueDate) {
  const li = document.createElement("li");
  li.textContent = text;

  if (completed) li.classList.add("completed");

  // Add due date + check if overdue
  if (dueDate) {
    const dateSpan = document.createElement("span");
    const today = new Date();
    const due = new Date(dueDate);

    if (due < today && !completed) {
      dateSpan.textContent = ` (Overdue: ${dueDate})`;
      dateSpan.classList.add("overdue");
      li.classList.add("overdue-task");
    } else {
      dateSpan.textContent = ` (Due: ${dueDate})`;
      dateSpan.classList.add("due-date");
    }

    li.appendChild(dateSpan);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");
  li.appendChild(deleteBtn);
  list.appendChild(li);

  // Toggle complete
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    const index = Array.from(list.children).indexOf(li);
    tasks[index].completed = li.classList.contains("completed");
    saveTasks();
  });

  // Delete task
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = Array.from(list.children).indexOf(li);
    tasks.splice(index, 1);
    saveTasks();
    li.remove();
  });
}

tasks.forEach(task => {
  addTaskToDOM(task.text, task.completed, task.dueDate);
});

