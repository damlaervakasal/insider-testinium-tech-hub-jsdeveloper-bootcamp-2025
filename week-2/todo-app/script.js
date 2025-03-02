document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  const completedList = document.getElementById("completed-list");
  const trashModal = document.getElementById("trashModal");
  const openTrashModalBtn = document.getElementById("openTrashModalBtn");
  const closeTrashModalBtn = document.querySelector(".close-trash");
  const trashModalList = document.getElementById("trashModalList");
  const modal = document.getElementById("taskModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.querySelector(".close-btn");
  const taskForm = document.getElementById("taskForm");
  const errorMessage = document.getElementById("error-message");

  const deletedTasks = [];

  modal.style.display = "none";
  trashModal.style.display = "none";

  openModalBtn.addEventListener("click", () => (modal.style.display = "flex"));
  closeModalBtn.addEventListener("click", () => (modal.style.display = "none"));
  openTrashModalBtn.addEventListener("click", () => {
    trashModal.style.display = "flex";
    updateTrashModalList();
  });
  closeTrashModalBtn.addEventListener(
    "click",
    () => (trashModal.style.display = "none")
  );

  window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === trashModal) {
      modal.style.display = "none";
      trashModal.style.display = "none";
    }
  });

  document.querySelectorAll(".trashModalList").forEach((title) => {
    const maxLength = 20;
    if (title.textContent.length > maxLength) {
      title.textContent = title.textContent.substring(0, maxLength) + "...";
    }
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    errorMessage.textContent = "";

    const title = document.getElementById("task-title").value;
    const priority = document.querySelector(
      "input[name='priority']:checked"
    )?.value;
    const description = document.getElementById("task-desc").value;

    if (!title) {
      errorMessage.textContent = "Title field cannot be empty!";
      return;
    }

    if (title.length > 20) {
      errorMessage.textContent = "Title must not exceed 20 characters!";
      return;
    }

    if (!priority) {
      errorMessage.textContent = "Please select a priority!";
      return;
    }

    addTask(title, priority, description);
    modal.style.display = "none";
    taskForm.reset();
  });

  function addTask(title, priority, description) {
    try {
      const taskItem = createTaskElement(title, priority, description, "todo");
      todoList.appendChild(taskItem);
      sortTasksByPriority(todoList);
      showPopup("Task added!", "#4CAF50");
    } catch (error) {
      console.log("Error adding task:", error);
    }
  }

  function createTaskElement(title, priority, description, listType) {
    const article = document.createElement("article");
    article.classList.add("task-item");

    const header = document.createElement("header");
    header.classList.add("task-header");

    const titleElem = document.createElement("h3");
    titleElem.classList.add("task-title");
    titleElem.textContent = title;

    header.appendChild(titleElem);

    const section = document.createElement("section");
    section.classList.add("task-details");

    const priorityElem = document.createElement("em");
    priorityElem.classList.add("task-priority");
    priorityElem.textContent = priority;

    const descriptionElem = document.createElement("p");
    descriptionElem.classList.add("task-desc");
    descriptionElem.textContent = description;

    section.appendChild(priorityElem);
    section.appendChild(descriptionElem);

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    if (listType === "todo") {
      const completeBtn = document.createElement("button");
      completeBtn.classList.add("complete-btn");
      completeBtn.dataset.action = "complete";
      taskActions.appendChild(completeBtn);
    }

    if (listType === "completed") {
      const restoreBtn = document.createElement("button");
      restoreBtn.classList.add("restore-btn");
      restoreBtn.dataset.action = "restore";
      taskActions.appendChild(restoreBtn);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.action = "delete";
    taskActions.appendChild(deleteBtn);

    article.appendChild(header);
    article.appendChild(section);
    article.appendChild(taskActions);

    return article;
  }

  todoList.addEventListener("click", handleTaskAction);
  completedList.addEventListener("click", handleTaskAction);
  trashModalList.addEventListener("click", handleTrashAction);

  function handleTaskAction(event) {
    event.stopPropagation();
    const target = event.target;
    const taskElement = target.closest(".task-item");

    if (!taskElement) return;

    const title = taskElement.querySelector(".task-title").textContent;
    const priority = taskElement.querySelector(".task-priority").textContent;
    const description = taskElement.querySelector(".task-desc").textContent;

    switch (target.dataset.action) {
      case "complete":
        moveToCompleted(taskElement, title, priority, description);
        break;

      case "delete":
        moveToTrash(taskElement, title, priority, description);
        break;

      case "restore":
        moveToTodo(taskElement, title, priority, description);
        break;
    }
  }

  function handleTrashAction(event) {
    const target = event.target;

    if (target.classList.contains("permanent-delete-btn")) {
      const index = target.dataset.index;
      deletedTasks.splice(index, 1);
      updateTrashModalList();
    }
  }

  function moveToCompleted(taskElement, title, priority, description) {
    taskElement.remove();
    const taskItem = createTaskElement(
      title,
      priority,
      description,
      "completed"
    );
    completedList.appendChild(taskItem);
    sortTasksByPriority(completedList);
    showPopup("Task completed!", "#2196F3");
  }

  function moveToTrash(taskElement, title, priority, description) {
    taskElement.remove();
    deletedTasks.push({ title, priority, description });
    showPopup("Task deleted!", "#f44336");
  }

  function moveToTodo(taskElement, title, priority, description) {
    taskElement.remove();
    const taskItem = createTaskElement(title, priority, description, "todo");
    todoList.appendChild(taskItem);
    sortTasksByPriority(todoList);
    showPopup("Task restored!", "#4CAF50");
  }

  function sortTasksByPriority(list) {
    const tasks = Array.from(list.children);

    tasks.sort((a, b) => {
      const priorityA = a.querySelector(".task-priority").textContent;
      const priorityB = b.querySelector(".task-priority").textContent;

      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[priorityB] - priorityOrder[priorityA];
    });

    tasks.forEach((task) => list.appendChild(task));
  }

  function updateTrashModalList() {
    trashModalList.innerHTML = "";

    deletedTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <span>${task.title}</span>
                <button class="permanent-delete-btn" data-index="${index}">Permanently Delete </button>
            `;
      trashModalList.appendChild(li);
    });
  }

  function showPopup(message, backgroundColor) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.style.display = "block";
    popup.style.backgroundColor = backgroundColor;

    setTimeout(() => {
      popup.style.display = "none";
    }, 3000);
  }
});
