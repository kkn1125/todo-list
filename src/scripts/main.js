"use strict";

import Component from "./Component.js";
import { $ } from "./tools.js";

const initialMessage = "일정이 없습니다.";

class ArrayComponent extends Component {
  #stacks = [];

  constructor(el) {
    super();
    super.target = el;
    window.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target;
      const closest = target.closest(".item");
      if (!closest) return;
      const id = closest.dataset.index;
      const isVisible = !JSON.parse(closest.dataset.value);
      this.edit(Number(id), "isVisible", isVisible);
    });
    window.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target;
      const closest = target.closest(".del");
      if (!closest) return;
      const id = closest.dataset.index;
      this.delete(Number(id));
    });
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      this.add({ category: "none", content: $("#insert").value.trim() });
      $("input#insert").value = "";
      $("input#insert").focus();
    });
    this.render();
  }

  setWriteButton(el) {
    $(el).addEventListener("click", () => {
      this.add({ category: "none", content: $("#insert").value.trim() });
      $("input#insert").value = "";
      $("input#insert").focus();
    });
  }

  createItem({ id, category, content, isVisible, created_at, updated_at }) {
    const divEL = document.createElement("div");
    const numEL = document.createElement("span");
    const contentsEL = document.createElement("span");
    const timeWrap = document.createElement("span");
    const createEL = document.createElement("time");
    const updateEL = document.createElement("time");

    const delEL = document.createElement("span");
    delEL.classList.add("del");

    divEL.dataset.index = id;
    divEL.dataset.value = isVisible;
    delEL.dataset.index = id;

    divEL.classList.add("item");
    numEL.classList.add("num");
    contentsEL.classList.add("content");
    timeWrap.classList.add("time-wrap");
    createEL.classList.add("create");
    updateEL.classList.add("update");

    numEL.innerHTML = id;
    contentsEL.innerHTML = content;
    createEL.innerHTML = super.format("YYYY.MM.DD HH:mm:ss", new Date(created_at));
    updateEL.innerHTML = super.format("YYYY.MM.DD HH:mm:ss", new Date(updated_at));
    delEL.innerHTML = "❌";

    timeWrap.append(createEL, updateEL);
    divEL.append(numEL, contentsEL, timeWrap, delEL);

    return divEL;
  }

  render() {
    let htmls = initialMessage;
    if (this.#stacks.length > 0) htmls = "";
    this.#stacks.forEach((item) => {
      // if (!item.isVisible) return;
      htmls += this.createItem(item).outerHTML;
    });
    $("#current").innerHTML = this.#stacks.filter(
      (item) => !item.isVisible
    ).length;
    $("#total").innerHTML = this.#stacks.length;
    super.publish(htmls);
  }

  add({ category, content }) {
    this.#stacks.push({
      id: this.#stacks.length,
      category,
      content,
      isVisible: true,
      created_at: super.getDate(),
      updated_at: super.getDate(),
    });
    this.render();
  }

  edit(id, key, value) {
    this.#stacks[id][key] = value;
    this.#stacks[id]["updated_at"] = super.getDate();
    this.render();
  }

  editAll(object) {
    delete object["id"];
    delete object["created_at"];
    delete object["updated_at"];

    this.#stacks = this.#stacks.map((item, index) => ({
      ...item,
      id: index,
      ...object,
      updated_at: super.getDate(),
    }));
    this.render();
  }

  delete(id) {
    this.#stacks.splice(id, 1);
    this.#stacks = this.#stacks.map((item, index) => ({ ...item, id: index }));
    this.render();
  }

  clear() {
    this.#stacks = [];
  }
}

class IOComponent extends Component {
  constructor() {
    super();
  }
}

const todoList = new ArrayComponent("#list");
todoList.setWriteButton("#btn");

todoList.add({
  category: "wow",
  content: "test",
});
