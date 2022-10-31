import { $ } from "./tools.js";

class Component {
  #target;
  #htmlStrings;

  constructor() {}

  set target(el) {
    this.#target = $(el);
  }

  get target() {
    return this.#target;
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

  publish(htmlStrings) {
    this.#htmlStrings = htmlStrings;
    this.#update();
  }

  unPublish() {
    this.#htmlStrings = "";
  }

  getDate() {
    return new Date().getTime();
  }
  #update() {
    this.#init();
    this.#target.innerHTML = this.#htmlStrings;
  }
  #init() {
    this.#target.innerHTML = "";
  }
}

export default Component;
