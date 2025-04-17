class TaskRenderer {
  constructor() {
    if (this.constructor === TaskRenderer) {
      throw new Error("Classe abstraite TaskRenderer ne peut pas être instanciée directement");
    }
  }

  render(task) {
    throw new Error("La méthode render() doit être implémentée");
  }
}

class WorkTaskRenderer extends TaskRenderer {
  render(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.dataset.category = 'travail';
    li.style.borderLeft = `5px solid var(--category-travail)`;
    li.style.backgroundColor = '#fff8f8';
    return li;
  }
}

class HomeTaskRenderer extends TaskRenderer {
  render(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.dataset.category = 'maison';
    li.style.borderLeft = `5px solid var(--category-maison)`;
    li.style.backgroundColor = '#f0f8ff';
    return li;
  }
}

class MiscTaskRenderer extends TaskRenderer {
  render(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.dataset.category = 'divers';
    li.style.borderLeft = `5px solid var(--category-divers)`;
    li.style.backgroundColor = '#f0fff4';
    return li;
  }
}

class TaskView {
  constructor() {
    this.app = document.getElementById('app');
    
    this.title = document.createElement('h1');
    
    this.counter = document.createElement('div');
    this.counter.className = 'task-counter';
    this.counter.innerHTML = '<i class="fas fa-clipboard-list"></i> <span>0</span> tâches';
    
    this.form = document.createElement('form');
    
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Ajouter une nouvelle tâche...';
    
    this.categorySelect = document.createElement('select');
    this.categorySelect.id = 'category';
    
    const allOption = document.createElement('option');
    allOption.value = 'toutes';
    allOption.textContent = 'Toutes les catégories';
    this.categorySelect.appendChild(allOption);
    
    const categories = new TaskModel().getCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      this.categorySelect.appendChild(option);
    });
    
    this.button = document.createElement('button');
    this.button.type = 'submit';
    this.button.innerHTML = '<i class="fas fa-plus"></i> Ajouter';

    this.taskContainer = document.createElement('div');
    this.taskContainer.className = 'task-container';
    
    this.list = document.createElement('ul');
    this.list.className = 'task-list';
    
    this.filterContainer = document.createElement('div');
    this.filterContainer.className = 'filter-container';
    
    this.filterLabel = document.createElement('label');
    this.filterLabel.innerHTML = '<i class="fas fa-filter"></i> Filtrer par catégorie:';
    
    this.filterSelect = document.createElement('select');
    this.filterSelect.id = 'filter';
    
    for (let i = 0; i < this.categorySelect.options.length; i++) {
      this.filterSelect.appendChild(this.categorySelect.options[i].cloneNode(true));
    }
   
    this.createDecorations();
    
    this.filterContainer.append(this.filterLabel, this.filterSelect);
    this.form.append(this.input, this.categorySelect, this.button);
    this.taskContainer.append(this.filterContainer, this.list);
    this.app.append(this.title, this.counter, this.form, this.taskContainer);

    this.renderers = {
      'travail': new WorkTaskRenderer(),
      'maison': new HomeTaskRenderer(),
      'divers': new MiscTaskRenderer()
    };
  }

  createDecorations() {
    const bubbles = document.createElement('div');
    bubbles.className = 'decoration-bubbles';
    
    for (let i = 0; i < 8; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      

      const size = Math.floor(Math.random() * 40) + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      bubble.style.top = `${Math.floor(Math.random() * 100)}%`;
      bubble.style.left = `${Math.floor(Math.random() * 100)}%`;

      bubble.style.animationDelay = `${Math.random() * 5}s`;
      
      bubbles.appendChild(bubble);
    }
    
    this.app.appendChild(bubbles);
  }

  updateTaskCounter(count) {
    this.counter.querySelector('span').textContent = count;
  }

  bindAddTask(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.input.value.trim()) {
        handler(this.input.value, this.categorySelect.value);
        this.input.value = '';
        
        this.button.classList.add('added');
        setTimeout(() => {
          this.button.classList.remove('added');
        }, 700);
        
        this.input.focus();
      }
    });
  }

  bindFilterChange(handler) {
    this.filterSelect.addEventListener('change', (e) => {
      handler(e.target.value);
    });
  }

  bindDeleteTask(handler) {
    this.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-btn')) {
        const taskElement = e.target.closest('li');
        const taskId = parseInt(taskElement.dataset.id);
        
        taskElement.classList.add('deleting');

        setTimeout(() => {
          handler(taskId);
        }, 300);
      }
    });
  }

  displayTasks(tasks) {
    this.list.innerHTML = '';
    this.updateTaskCounter(tasks.length);
    
    if (tasks.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.innerHTML = '<i class="fas fa-info-circle"></i> Aucune tâche à afficher';
      emptyMessage.className = 'empty-message';
      this.list.appendChild(emptyMessage);
      return;
    }
    
    tasks.forEach(task => {
      const renderer = this.renderers[task.category] || this.renderers['divers'];
      const taskElement = renderer.render(task);
      
      const taskContainer = document.createElement('div');
      taskContainer.className = 'task-text';
      taskContainer.textContent = task.text;
      
      const categorySpan = document.createElement('span');
      categorySpan.className = 'category-tag';
      categorySpan.textContent = task.category;
      categorySpan.style.backgroundColor = task.getCategoryColor();
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.setAttribute('title', 'Supprimer cette tâche');
      
      const taskActions = document.createElement('div');
      taskActions.className = 'task-actions';
      taskActions.append(categorySpan, deleteBtn);
      
      taskElement.innerHTML = '';
      taskElement.appendChild(taskContainer);
      taskElement.appendChild(taskActions);
      
      setTimeout(() => {
        taskElement.classList.add('appear');
      }, 10 * tasks.indexOf(task));
      
      this.list.appendChild(taskElement);
    });
  }
}