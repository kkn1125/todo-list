import TaskManager from "@model/TaskManager";
import { atom } from "recoil";

export const taskAtom = atom({
  key: "taskManager",
  default: new TaskManager(),
});
