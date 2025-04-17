class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentCategory = 'toutes';

    this.view.bindAddTask(this.handleAddTask.bind(this));
    this.view.bindFilterChange(this.handleFilterChange.bind(this));
    this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
    
    this.refreshTaskList();
  }

  handleAddTask(taskText, category) {
    this.model.addTask(taskText, category);
    this.refreshTaskList();
    
    this.showNotification(`Tâche ajoutée avec succès`, 'success');
  }

  handleDeleteTask(taskId) {
    this.model.deleteTask(taskId);
    this.refreshTaskList();
    
    this.showNotification(`Tâche supprimée`, 'warning');
  }

  handleFilterChange(category) {
    this.currentCategory = category;
    this.refreshTaskList();
  }

  showNotification(message, type = 'info') {
    let notification = document.querySelector('.notification');
    
    if (notification) {
      notification.remove();
    }
    
    notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-circle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  refreshTaskList() {
    const tasks = this.model.getTasksByCategory(this.currentCategory);
    this.view.displayTasks(tasks);
  }
}

const app = new Controller(new TaskModel(), new TaskView());