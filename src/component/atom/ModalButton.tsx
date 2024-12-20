import {
  TaskManagerContext,
  TaskManagerDispatchContext,
} from "@/provider/context/TaskManagerContext";
import { TaskActionType } from "@/provider/context/taskManagerValue";
import { FS_SMALL } from "@common/size";
import Task from "@model/Task";
import {
  Button,
  Modal,
  Box,
  Typography,
  Portal,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ChangeEvent, useContext, useState } from "react";
import { Fragment } from "react/jsx-runtime";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ModalButtonProps {
  label: string;
}
const ModalButton: React.FC<ModalButtonProps> = ({ label }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const taskManager = useContext(TaskManagerContext);
  const taskManagerDispatch = useContext(TaskManagerDispatchContext);
  const [data, setData] = useState<
    Partial<Pick<Task, "name" | "startTime" | "endTime">>
  >({
    name: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  const fetchData = { type: TaskActionType.Fetch };
  const endData = { type: TaskActionType.End };

  async function handleAddTask() {
    taskManagerDispatch(fetchData);
    await taskManager.addTask(new Task(data.name));
    taskManagerDispatch({
      type: TaskActionType.Save,
      manager: taskManager,
    });
    taskManagerDispatch(endData);
    setData({ name: "" });
    handleClose();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  }

  return (
    <Fragment>
      <Button variant='contained' onClick={handleOpen}>
        {label}
      </Button>
      <Portal>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'>
          <Paper
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              width: 400,
              transform: "translate(-50%, -50%)",
            }}>
            <Stack p={3}>
              <Typography fontSize={FS_SMALL} fontWeight={700}>
                Task
              </Typography>
              <TextField
                name='name'
                autoFocus
                type='text'
                size='small'
                value={data.name || ""}
                onChange={handleChange}
              />
              <Typography fontSize={FS_SMALL} fontWeight={700}>
                Start
              </Typography>
              <DateTimePicker
                name='startTime'
                format='YYYY. MM. DD'
                value={dayjs(data.startTime)}
                slotProps={{ textField: { size: "small" } }}
                onChange={(value) => {
                  setData((data) => ({ ...data, startTime: value?.toDate() }));
                }}
              />
              <Typography fontSize={FS_SMALL} fontWeight={700}>
                End
              </Typography>
              <DateTimePicker
                name='endTime'
                format='YYYY. MM. DD'
                value={dayjs(data.endTime)}
                slotProps={{ textField: { size: "small" } }}
                onChange={(value) => {
                  setData((data) => ({ ...data, endTime: value?.toDate() }));
                }}
              />
              <Button onClick={handleAddTask}>Add</Button>
            </Stack>
          </Paper>
        </Modal>
      </Portal>
    </Fragment>
  );
};

export default ModalButton;
