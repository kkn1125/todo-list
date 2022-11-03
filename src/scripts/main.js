"use strict";

import Component from "./Component.js";
import { $ } from "./tools.js";

const initialMessage = "일정이 없습니다.";

class ArrayComponent extends Component {
  id = 0;
  stacks = null;
  constructor(el) {
    super(el);
    this.stacks = [];
  }
  add(data) {
    this.stacks.push({
      id: this.id,
      category: data.category,
      content: data.content,
      visible: true,
      deleted: false,
      create: new Date().getTime(),
      update: new Date().getTime(),
    });
    this.id++;
    super.setHtml(
      this.stacks.map(
        (
          { id, category, content, visible, deleted, create, update },
          index
        ) => `<div class="item">
    <span class="num"> ${index} </span>
    <span class="content">
      <span>
        ${content}
      </span>
    </span>
    <span class="time-wrap">
      <time class="create"> ${super.format(
        "YYYY-MM-DD HH:mm:ss",
        new Date(create < update ? update : create)
      )} </time>
      <button class="btn edit">✒️</button>
      <button class="btn del">❌</button>
    </span>
  </div>`
      )
    );
    super.render();
  }
  delete(data) {
    this.stacks.splice(this.findIndex(data.id));
  }
  findIndex(id) {
    return this.stacks.find((stack) => stack.id === id);
  }
  clear() {
    this.stacks = [];
  }
  size() {
    return this.stacks.length;
  }
}

const comp = new ArrayComponent("#list");
comp.add({
  id: 1,
  content: "test",
});
