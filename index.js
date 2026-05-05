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
  }

  onAddInputChange(event) {
    this.state.newTaskTitle = event.target.value;
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, null, [
          { eventName: "input", callback: this.onAddInputChange },
        ]),
        createElement("button", { id: "add-btn" }, "+", [
          { eventName: "click", callback: this.onAddTask },
        ]),
      ]),
      createElement("ul", { id: "todos" }, this.state.tasks.map((task) => (
        createElement("li", {}, [
          createElement("input", task.completed
            ? { type: "checkbox", checked: "checked" }
            : { type: "checkbox" }),
          createElement("label", {}, task.title),
          createElement("button", {}, "🗑️")
        ])
      ))),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
