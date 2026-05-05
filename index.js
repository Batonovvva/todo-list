function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (Array.isArray(callbacks)) {
    callbacks.forEach(({ eventName, callback }) => {
      element.addEventListener(eventName, callback);
    });
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();

    this._domNode.replaceWith(newDomNode);
    this._domNode = newDomNode;
  }
}

class AddTask extends Component {
  constructor({ newTaskTitle, onAddTask, onAddInputChange }) {
    super();

    this.newTaskTitle = newTaskTitle;
    this.onAddTask = onAddTask;
    this.onAddInputChange = onAddInputChange;
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement("input", {
        id: "new-todo",
        type: "text",
        placeholder: "Задание",
        value: this.newTaskTitle,
      }, null, [
        { eventName: "input", callback: this.onAddInputChange },
      ]),
      createElement("button", { id: "add-btn" }, "+", [
        { eventName: "click", callback: this.onAddTask },
      ]),
    ]);
  }
}

class Task extends Component {
  constructor({ task, onToggleTask, onDeleteTask }) {
    super();

    this.task = task;
    this.onToggleTask = onToggleTask;
    this.onDeleteTask = onDeleteTask;
  }

  render() {
    return createElement("li", {}, [
      createElement("input", this.task.completed
        ? { type: "checkbox", checked: "checked" }
        : { type: "checkbox" }, null, [
        { eventName: "change", callback: this.onToggleTask },
      ]),
      createElement("label", this.task.completed ? { class: "completed-task" } : {}, this.task.title),
      createElement("button", {}, "🗑️", [
        { eventName: "click", callback: this.onDeleteTask },
      ]),
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();

    this.state = {
      newTaskTitle: "",
      tasks: [
        { title: "Сделать домашку", completed: false },
        { title: "Сделать практику", completed: false },
        { title: "Пойти домой", completed: false },
      ],
    };

    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.onToggleTask = this.onToggleTask.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);
  }

  onAddTask() {
    const trimmedTitle = this.state.newTaskTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    this.state.tasks.push({
      title: trimmedTitle,
      completed: false,
    });
    this.state.newTaskTitle = "";

    this.update();
  }

  onAddInputChange(event) {
    this.state.newTaskTitle = event.target.value;
  }

  onToggleTask(taskIndex) {
    this.state.tasks[taskIndex].completed = !this.state.tasks[taskIndex].completed;
    this.update();
  }

  onDeleteTask(taskIndex) {
    this.state.tasks.splice(taskIndex, 1);
    this.update();
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask({
        newTaskTitle: this.state.newTaskTitle,
        onAddTask: this.onAddTask,
        onAddInputChange: this.onAddInputChange,
      }).getDomNode(),
      createElement("ul", { id: "todos" }, this.state.tasks.map((task, index) => (
        new Task({
          task,
          onToggleTask: () => this.onToggleTask(index),
          onDeleteTask: () => this.onDeleteTask(index),
        }).getDomNode()
      ))),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
