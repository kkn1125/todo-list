import LocalDB from "./LocalDB";
import Task from "./Task";

export default class TaskManager {
  static copy(newValue: TaskManager) {
    return new TaskManager(newValue);
  }

  localDb = new LocalDB();
  state: "Init" | "Fetch" | "End" = "Init";
  tasks: Task[] = [];

  constructor(props?: TaskManager) {
    if (props) {
      this.state = props.state;
      this.tasks = props.tasks.map((task) => Task.copy(task));
    }
  }

  get taskNames() {
    return this.tasks.map((task) => task.name);
  }

  get size() {
    return this.tasks.length;
  }

  get taskRatio() {
    return this.tasks.reduce(
      (acc, cur) => {
        if (cur.done) {
          acc.done += 1;
        } else {
          acc.wait += 1;
        }

        return acc;
      },
      {
        done: 0,
        wait: 0,
      }
    );
  }

  get percentage() {
    const percent = this.taskRatio.done / this.size;
    const value = percent > 0 ? percent : 0;
    return +(value * 100).toFixed(2);
  }

  sortList(key: Exclude<keyof Task, "id" | "edit" | "toJSON">) {
    return [...this.tasks]
      .sort((a, b) => {
        return a[key] < b[key] ? 1 : -1;
      })
      .map((task, index) => ({ no: index + 1, ...task }));
    // .map(({ id, ...task }, index) => ({ id: index + 1, ...task }));
  }

  async initializeTask() {
    await this.localDb.open();
    const list = await this.localDb.getAll();
    this.tasks = [];
    const convertedList = list.map((task) => Task.copy(task));
    this.tasks.push(...convertedList);
  }

  async addTask(task: Task) {
    this.tasks = [...this.tasks, task];
    this.localDb.set(null, task);
  }

  async updateTask(updateTask: Task) {
    this.tasks = this.tasks.map((task) =>
      task.id === updateTask.id ? updateTask : task
    );
    this.localDb.set(updateTask.id, updateTask);
  }

  async deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    await this.localDb.delete(id);
  }

  async done(id: string) {
    for (const task of this.tasks) {
      if (task.id === id) {
        task.done = true;
        await this.localDb.set(id, task);
      }
    }
  }

  async wait(id: string) {
    for (const task of this.tasks) {
      if (task.id === id) {
        task.done = false;
        await this.localDb.set(id, task);
      }
    }
  }
}
