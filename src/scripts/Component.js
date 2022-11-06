import { $ } from "./tools.js";

class Component {
  #replaces;

  #target;
  #current;
  #total;
  #gauge;
  #currentVal = 0;
  #totalVal = 0;
  #gaugeVal = 0;

  #originHtmlStrings;
  #htmlStrings;

  constructor(el) {
    this.#target = $(el);
    this.#current = $("#current");
    this.#total = $("#total");
    this.#gauge = $("#gauge");
  }

  getTarget() {
    return this.#target;
  }

  setCurrentVal(val) {
    this.#currentVal = val || 0;
  }
  setTotalVal(val) {
    this.#totalVal = val || 0;
  }
  getCurrentVal(val) {
    return this.#currentVal;
  }
  getTotalVal(val) {
    return this.#totalVal;
  }

  getOriginHtml() {
    return this.#originHtmlStrings;
  }

  setReplaces(replace) {
    this.#replaces = replace;
  }

  getReplaces() {
    return this.#replaces;
  }

  setHtml(htmlStrings) {
    this.#originHtmlStrings = htmlStrings;
    this.#htmlStrings = this.#originHtmlStrings + this.#replaces;
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
    // this.#reset();
    this.#update();
  }
  #update() {
    this.#target.innerHTML = this.#htmlStrings;
    this.#current.innerHTML = this.#currentVal;
    this.#total.innerHTML = this.#totalVal;
    this.#gaugeVal = this.#currentVal / this.#totalVal;
    this.#gauge.style.width = `${this.#gaugeVal * 100}%`;
    console.log(this.#gaugeVal * 100)
  }
  // #reset() {
  //   this.#target.innerHTML = "";
  // }
}

export default Component;
