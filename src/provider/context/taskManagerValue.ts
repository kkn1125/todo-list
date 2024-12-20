import Task from "@model/Task";
import TaskManager from "@model/TaskManager";

export const TaskActionType = {
  Fetch: "Fetch",
  End: "End",
  Save: "Save",
  Load: "Load",
} as const;

export type TaskAction = {
  type: string;
  state?: "Fetch" | "End";
  tasks?: Task[];
  manager?: TaskManager;
};

export const initialValue = new TaskManager();
