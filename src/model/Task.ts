import dayjs from "dayjs";
import { v4 } from "uuid";

export default class Task {
  static copy(task: any): any {
    return new Task(task);
  }

  id!: string;
  name: string = "default";
  startTime!: Date;
  endTime!: Date;
  done: boolean = false;
  edit: boolean = false;
  createdAt!: Date;

  constructor(name?: string);
  constructor(props?: Task);
  constructor(propsOrName?: string | Task) {
    if (propsOrName !== undefined) {
      if (typeof propsOrName === "string") {
        this.id = v4();
        this.name = propsOrName;
        this.createdAt = new Date();
      } else {
        this.id = propsOrName.id;
        this.name = propsOrName.name;
        this.startTime = propsOrName.startTime;
        this.endTime = propsOrName.endTime;
        this.done = propsOrName.done;
        this.createdAt = propsOrName.createdAt;
      }
    }
  }

  get duration() {
    const startTime = dayjs(this.startTime);
    const endTime = dayjs(this.endTime);
    const dayDiff = dayjs(endTime).diff(startTime, "day");
    const hourDiff = dayjs(endTime).diff(startTime, "hour");
    const minuteDiff = dayjs(endTime).diff(startTime, "minute");
    return {
      dayDiff,
      hourDiff,
      minuteDiff,
    };
  }

  toJSON() {
    return { ...this };
  }
}
