import { $ } from "./tools.js";

let toggle = false;
const insertButton = `
<div class="new-item"></div>
`;
const insertForm = `
<div class="insert-item">
  <datalist id="data-list" class="smooth">
    <option value="Egg" />
  </datalist>
  <input list="data-list" />
  <input type="text" />
  <button class="btn" style="padding: 0.5rem 0.8rem; background-color: #136e20;color: #fff;">check</button>
</div>
`;

let replaces = insertButton;

class Component {
  #target;
  #originHtmlStrings;
  #htmlStrings;

  constructor(el) {
    this.#target = $(el);

    window.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target;
      const insertBtn = target.closest(".new-item");
      const insertItem = target.closest(".btn");
      // TODO: 여기 손 봐야함
      if (insertBtn) {
        toggle = !toggle;
        if (toggle) {
          replaces = insertForm;
        } else {
          replaces = insertButton;
        }
      } else if (
        target === insertItem &&
        insertItem.parentNode.classList.contains(".insert-item")
      ) {
        console.log(insertItem.parentNode);
        console.log(insertItem.previousElementSibling);
      }
      this.setHtml(this.#originHtmlStrings);
      this.render();
    });
  }

  toggle() {}

  getTarget() {
    return this.#target;
  }

  setHtml(htmlStrings) {
    this.#originHtmlStrings = htmlStrings;
    this.#htmlStrings = this.#originHtmlStrings + replaces;
  }

  getHtml() {
    return this.#htmlStrings;
  }

  format(form, time) {
    return form.replace(/YYYY|MM|DD|HH|mm|ss|SSS|AP/g, ($1) => {
      const year = time.getFullYear();
      const month = time.getMonth();
      const day = time.getMinutes();
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const milliseconds = time.getMilliseconds();
      const isOver = hours > 12;
      const padding = (val) => val.toString().padStart(2, 0);

      switch ($1) {
        case "YYYY":
          return padding(year);
        case "MM":
          return padding(month);
        case "DD":
          return padding(day);
        case "HH":
          return padding(hours);
        case "mm":
          return padding(minutes);
        case "ss":
          return padding(seconds);
        case "SSS":
          return padding(milliseconds);
        case "AP":
          return isOver ? "PM" : "AM";
        default:
          return $1;
      }
    });
  }

  getDate() {
    return new Date().getTime();
  }
  render() {
    this.#reset();
    this.#update();
  }
  #update() {
    this.#target.innerHTML = this.#htmlStrings;
  }
  #reset() {
    this.#target.innerHTML = "";
  }
}

export default Component;
