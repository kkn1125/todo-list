import { useLayoutEffect, useReducer } from "react";
import {
  TaskManagerContext,
  TaskManagerDispatchContext,
} from "./context/TaskManagerContext";
import {
  initialValue,
  TaskAction,
  TaskActionType,
} from "./context/taskManagerValue";
import TaskManager from "@model/TaskManager";

const reducer = (state: TaskManager, action: TaskAction) => {
  switch (action.type) {
    case TaskActionType.Load:
      if (action.tasks) {
        state.tasks = [...action.tasks];
      }
      return TaskManager.copy(state);
    case TaskActionType.Save:
      return TaskManager.copy(action.manager || state);
    case TaskActionType.Fetch:
      state.state = "Fetch";
      return TaskManager.copy(state);
    case TaskActionType.End:
      state.state = "End";
      return TaskManager.copy(state);
    default:
      return TaskManager.copy(state);
  }
};

interface TaskManagerProviderProps {
  children: React.ReactNode;
}
const TaskManagerProvider: React.FC<TaskManagerProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  return (
    <TaskManagerDispatchContext.Provider value={dispatch}>
      <TaskManagerContext.Provider value={state}>
        {children}
      </TaskManagerContext.Provider>
    </TaskManagerDispatchContext.Provider>
  );
};

export default TaskManagerProvider;
