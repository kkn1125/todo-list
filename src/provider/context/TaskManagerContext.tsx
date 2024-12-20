import { createContext } from "react";
import { initialValue, TaskAction } from "./taskManagerValue";

export const TaskManagerContext = createContext(initialValue);
export const TaskManagerDispatchContext = createContext(
  (action: TaskAction) => {}
);
