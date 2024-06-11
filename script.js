document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from the backend
    const loadTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/tasks');
            const tasks = await response.json();
            tasks.forEach(task => {
                addTaskToDOM(task._id, task.text, task.completed);
            });
        } catch (err) {
            console.error('Error loading tasks', err);
        }
    };

    // Save task to the backend
    const saveTask = async (taskText) => {
        try {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskText, completed: false }),
            });
            const newTask = await response.json();
            addTaskToDOM(newTask._id, newTask.text, newTask.completed);
        } catch (err) {
            console.error('Error saving task', err);
        }
    };

    // Update task in the backend
    const updateTask = async (id, completed) => {
        try {
            await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }),
            });
        } catch (err) {
            console.error('Error updating task', err);
        }
    };

    // Delete task from the backend
    const deleteTask = async (id) => {
        try {
            await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'DELETE',
            });
        } catch (err) {
            console.error('Error deleting task', err);
        }
    };

    // Add task to the DOM
    const addTaskToDOM = (id, taskText, completed = false) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = completed;

        const span = document.createElement('span');
        span.textContent = taskText;
        span.className = 'task-text';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        if (completed) {
            li.classList.add('completed');
        }

        // Event listener for the checkbox
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
            updateTask(id, checkbox.checked);
        });

        // Event listener for the delete button
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
            deleteTask(id);
        });
    };

    // Add task function
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        saveTask(taskText);
        taskInput.value = '';
    };

    // Event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Load tasks on initial load
    loadTasks();
});
