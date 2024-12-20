import { Button, Stack } from "@mui/material";
import {
  GridRowModes,
  GridRowModesModel,
  GridSlotProps,
  GridToolbarContainer,
  useGridApiContext,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import {
  TaskManagerContext,
  TaskManagerDispatchContext,
} from "@/provider/context/TaskManagerContext";
import { TaskActionType } from "@/provider/context/taskManagerValue";
import Task from "@model/Task";
import { Dispatch, SetStateAction, useContext } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface EditToolbarProps {
  setRowModesModel: Dispatch<SetStateAction<GridRowModesModel>>;
}
const EditToolbar: React.FC<GridSlotProps["toolbar"]> = (props) => {
  const apiRef = useGridApiContext();
  const { setRowModesModel } = props;
  const taskManager = useContext(TaskManagerContext);
  const taskManagerDispatch = useContext(TaskManagerDispatchContext);

  const handleClick = async () => {
    const newTask = new Task("");
    await taskManager.addTask(newTask);
    taskManagerDispatch({
      type: TaskActionType.Save,
      manager: taskManager,
    });
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newTask.id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  async function handleDeleteSelected() {
    const selected = apiRef.current.getSelectedRows();
    const keys = selected.keys();
    for (const key of keys) {
      await taskManager.deleteTask(key as string);
    }
    taskManagerDispatch({
      type: TaskActionType.Save,
      manager: taskManager,
    });
  }

  async function handleDoneSelected() {
    const selected = apiRef.current.getSelectedRows();
    const keys = [...selected.keys()];
    for (const key of keys) {
      await taskManager.done(key as string);
    }
    for (const key of keys) {
      apiRef.current.selectRow(key, false);
    }
    taskManagerDispatch({
      type: TaskActionType.Save,
      manager: taskManager,
    });
  }

  async function handleWaitSelected() {
    const selected = apiRef.current.getSelectedRows();
    const keys = [...selected.keys()];
    for (const key of keys) {
      await taskManager.wait(key as string);
    }
    for (const key of keys) {
      apiRef.current.selectRow(key, false);
    }
    taskManagerDispatch({
      type: TaskActionType.Save,
      manager: taskManager,
    });
  }

  return (
    <GridToolbarContainer>
      <Stack direction='row' justifyContent='space-between' width='100%' px={1}>
        <Stack direction='row'>
          <Button color='primary' startIcon={<AddIcon />} onClick={handleClick}>
            Add record
          </Button>
          <Button
            color='primary'
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}>
            Delete record
          </Button>
        </Stack>
        <Stack direction='row'>
          <Button
            color='primary'
            startIcon={<CheckBoxIcon />}
            onClick={handleDoneSelected}>
            완료
          </Button>
          <Button
            color='primary'
            startIcon={<CheckBoxOutlineBlankIcon />}
            onClick={handleWaitSelected}>
            미완료
          </Button>
        </Stack>
      </Stack>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
