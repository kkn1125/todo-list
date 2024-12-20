import TaskManager from "@model/TaskManager";
import { taskAtom } from "@recoil/task.atom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

interface RecoilUpdateProps {}
const RecoilUpdate: React.FC<RecoilUpdateProps> = () => {
  const [taskManager, setTaskManager] = useRecoilState(taskAtom);

  const addTask = () => {
    setTaskManager((taskManager) => {
      const newManager = TaskManager.copy(taskManager);
      return newManager;
    });
  };

  useEffect(() => {
    addTask();
  }, []);

  return <div>{taskManager.size}</div>;
};

export default RecoilUpdate;
