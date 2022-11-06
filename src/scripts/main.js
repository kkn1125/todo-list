"use strict";

import Component from "./Component.js";

class Item {
  id;
  category;
  content;
  visible;
  deleted;
  done;
  create;
  update;

  constructor({
    id,
    category,
    content,
    visible,
    deleted,
    done,
    create,
    update,
  }) {
    this.id = id;
    this.category = category;
    this.content = content;
    this.visible = visible ?? true;
    this.deleted = deleted ?? false;
    this.done = done ?? false;
    this.create = create ?? new Date().getTime();
    this.update = update ?? new Date().getTime();
  }

  toggleVisible() {
    this.visible = !this.visible;
  }

  deletion() {
    this.deleted = true;
  }
}

class ArrayComponent extends Component {
  #template = () =>
    this.stacks
      .filter((item) => item.visible && !item.deleted)
      .map(
        (
          { id, category, content, visible, deleted, done, create, update },
          index
        ) =>
          `<div class="item"${done ? " data-done" : ""}>
            <span class="num"> ${category} </span>
            <span class="content" data-id="${id}">
            <span>
              ${content}
            </span>
            </span>
            <span class="time-wrap">
            <time class="${
              create < update ? "update" : "create"
            }"> ${super.format(
            "YYYY-MM-DD HH:mm:ss",
            new Date(create < update ? update : create)
          )} </time>
            <button class="btn done" data-id="${id}">✔️</button>
            <button class="btn del" data-id="${id}">❌</button>
            </span>
          </div>`
      )
      .join("");
  #insertButton = `
  <div class="new-item"></div>
  `;
  #insertForm = (index) => {
    const { id, category, content, visible, deleted, done, create, update } =
      this.findIndex(index ?? -1);
    return `
    <div class="insert-item">
    <datalist id="data-list" class="smooth">
      <option value="Todo" />
        <option value="Work" />
        <option value="Test" />
        <option value="Presentation" />
        <option value="Plan" />
      </datalist>
      <input list="data-list" value="${category ? category : "Todo"}" />
      <input type="text" autofocus value="${content ? content : ""}"/>
      <button class="btn check"${id !== undefined ? ` data-id='${id}'` : ""}>${
      index !== undefined ? "update" : "check"
    }</button>
      <button class="btn cancel">cancel</button>
    </div>
    `;
  };

  id = 0;
  stacks = null;
  constructor(el) {
    super(el);
    this.stacks = [];
    if (!localStorage.tasks) {
      localStorage.setItem("tasks", JSON.stringify(this.stacks));
    } else {
      this.stacks = JSON.parse(localStorage.getItem("tasks"))
        .map((item) => new Item(item))
        .sort((a, b) => {
          if (a.id - b.id > 0) {
            return 1;
          } else if (a.id - b.id < 0) {
            return -1;
          } else {
            return 0;
          }
        });
      this.id = this.stacks.slice(-1)[0].id + 1;
    }

    super.setReplaces(this.#insertButton);
    super.setCurrentVal(this.stacks.filter((item) => !item.done).length);
    super.setTotalVal(this.size());
    super.setHtml(this.#template());
    super.render();
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        super.setReplaces(this.#insertButton);
        this.preUpdate();
      } else if (e.key === "Enter") {
        e.target.parentNode.querySelector(".btn.check").click();
      }
    });
    window.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target;
      const closest = (selector) => target.closest(selector);
      const contains = (args) => target.classList.contains(args);

      // TODO: 여기 손 봐야함
      if (closest(".new-item")) {
        super.setReplaces(this.#insertForm());
        this.preUpdate();
      } else if (closest(".btn.check")) {
        const parent = closest(".btn").closest(".insert-item");
        const category = parent.querySelector("input[list]").value;
        const content = parent.querySelector("input[type]").value;
        if (closest(".btn.check").dataset.id !== undefined) {
          this.update({
            id: Number(closest(".btn.check").dataset.id),
            category,
            content,
            update: new Date().getTime(),
          });
        } else {
          this.add({ category, content });
        }
        super.setReplaces(this.#insertButton);
        this.preUpdate();
      } else if (contains("done")) {
        this.stacks = this.stacks.map((item) =>
          item.id === Number(target.dataset.id)
            ? new Item({
                ...item,
                done: !item.done,
                update: new Date().getTime(),
              })
            : item
        );
        super.setReplaces(this.#insertButton);
        this.preUpdate();
      } else if (contains("del")) {
        this.stacks = this.stacks.filter(
          (item) => item.id !== Number(target.dataset.id)
        );
        this.preUpdate();
      } else if (contains("cancel")) {
        super.setReplaces(this.#insertButton);
        this.preUpdate();
      } else if (closest(".content")) {
        const parent = closest(".content").parentNode;
        parent.insertAdjacentHTML(
          "beforebegin",
          this.#insertForm(Number(closest(".content").dataset.id))
        );
        parent.remove();
      }
    });
  }
  preUpdate() {
    super.setHtml(this.#template());
    super.setCurrentVal(this.stacks.filter((item) => !item.done).length);
    super.setTotalVal(this.size());
    super.render();
    localStorage.setItem("tasks", JSON.stringify(this.stacks));
  }
  add(data) {
    if (!data.category || !data.content) {
      return;
    }
    this.stacks.push(new Item({ ...data, id: this.id }));
    this.id++;
    this.preUpdate();
  }
  update(data) {
    this.stacks = this.stacks.map((item) =>
      item.id === data.id ? { ...item, ...data } : item
    );
  }
  delete(data) {
    this.stacks.splice(this.findIndex(data.id));
    this.preUpdate();
  }
  findIndex(id) {
    return this.stacks.find((item) => item.id === id) || {};
  }
  clear() {
    this.stacks = [];
    this.preUpdate();
  }
  size() {
    return this.stacks.length;
  }
}

const comp = new ArrayComponent("#list");
