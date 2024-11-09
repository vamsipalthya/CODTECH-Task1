class TodoApp {
    constructor() {
      // Initialize state
      this.todos = JSON.parse(localStorage.getItem('todos')) || []
      
      // Cache DOM elements
      this.todoForm = document.getElementById('todoForm')
      this.taskInput = document.getElementById('taskInput')
      this.dateInput = document.getElementById('dateInput')
      this.todoList = document.getElementById('todoList')
      this.progressFill = document.getElementById('progressFill')
      this.progressText = document.getElementById('progressText')
      
      // Bind event listeners
      this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e))
      
      // Initial render
      this.renderTodos()
      this.updateProgress()
    }
  
    handleSubmit(e) {
      e.preventDefault()
      const text = this.taskInput.value.trim()
      const date = this.dateInput.value
      
      if (text && date) {
        this.addTodo(text, date)
        this.taskInput.value = ''
        this.dateInput.value = ''
      }
    }
  
    addTodo(text, date) {
      const todo = {
        id: Date.now(),
        text,
        date,
        completed: false
      }
      this.todos.unshift(todo)
      this.saveTodos()
      this.renderTodos()
      this.updateProgress()
    }
  
    deleteTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id)
      this.saveTodos()
      this.renderTodos()
      this.updateProgress()
    }
  
    editTodo(id, li) {
      const todoText = li.querySelector('.todo-text')
      const editInput = li.querySelector('.edit-input')
      
      li.classList.add('editing')
      editInput.value = todoText.textContent
      editInput.focus()
      
      const saveEdit = () => {
        const newText = editInput.value.trim()
        if (newText) {
          this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
          )
          this.saveTodos()
          this.renderTodos()
        }
      }
  
      editInput.onblur = saveEdit
      editInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          saveEdit()
        }
      }
    }
  
    toggleTodo(id) {
      this.todos = this.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
      this.saveTodos()
      this.renderTodos()
      this.updateProgress()
    }
  
    updateProgress() {
      const progress = this.todos.length === 0 ? 0 :
        Math.round((this.todos.filter(todo => todo.completed).length / this.todos.length) * 100)
      this.progressFill.style.width = `${progress}%`
      this.progressText.textContent = `${progress}% Complete`
    }
  
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  
    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    }
  
    renderTodos() {
      this.todoList.innerHTML = this.todos
        .map(todo => `
          <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="checkbox-wrapper">
              <input
                type="checkbox"
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                onclick="app.toggleTodo(${todo.id})"
              >
            </div>
            <div class="todo-content">
              <div class="todo-text">${todo.text}</div>
              <input type="text" class="edit-input">
              <div class="todo-date">Due: ${this.formatDate(todo.date)}</div>
            </div>
            <div class="todo-actions">
              <button class="edit-btn" onclick="app.editTodo(${todo.id}, this.closest('.todo-item'))">
                Edit
              </button>
              <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">
                Delete
              </button>
            </div>
          </li>
        `)
        .join('')
    }
  }
  
  // Initialize the app and make it globally available
  window.app = new TodoApp()
