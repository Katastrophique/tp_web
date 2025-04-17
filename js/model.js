class Task {
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }
}

class CategoryTask extends Task {
  constructor(id, text, category) {
    super(id, text);
    this.category = category;
  }

  getCategoryColor() {
    const colors = {
      'travail': 'var(--category-travail)',
      'maison': 'var(--category-maison)',
      'divers': 'var(--category-divers)'
    };
    return colors[this.category] || '#adb5bd';
  }
}

class TaskModelSingleton {
  constructor() {
    if (TaskModelSingleton.instance) {
      return TaskModelSingleton.instance;
    }
    
    this.tasks = [];
    this.categories = ['travail', 'maison', 'divers'];
    
    this.loadTasks();
    
    TaskModelSingleton.instance = this;
  }

  static getInstance() {
    if (!TaskModelSingleton.instance) {
      TaskModelSingleton.instance = new TaskModelSingleton();
    }
    return TaskModelSingleton.instance;
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      this.tasks = parsedTasks.map(task => {
        return new CategoryTask(task.id, task.text, task.category);
      });
    }
  }

  addTask(taskText, category) {
    const task = new CategoryTask(Date.now(), taskText, category);
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
    return this.tasks;
  }

  getTasks() {
    return this.tasks;
  }

  getTasksByCategory(category) {
    if (category === 'toutes') {
      return this.tasks;
    }
    return this.tasks.filter(task => task.category === category);
  }

  getCategories() {
    return this.categories;
  }
}

class TaskModel {
  constructor() {
    this.singleton = TaskModelSingleton.getInstance();
  }

  addTask(taskText, category = 'divers') {
    return this.singleton.addTask(taskText, category);
  }

  deleteTask(taskId) {
    return this.singleton.deleteTask(taskId);
  }

  getTasks() {
    return this.singleton.getTasks();
  }

  getTasksByCategory(category) {
    return this.singleton.getTasksByCategory(category);
  }

  getCategories() {
    return this.singleton.getCategories();
  }
}