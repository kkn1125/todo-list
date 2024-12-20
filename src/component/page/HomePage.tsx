import {
  TaskManagerContext,
  TaskManagerDispatchContext,
} from "@/provider/context/TaskManagerContext";
import { TaskActionType } from "@/provider/context/taskManagerValue";
import { FS_LARGE } from "@common/size";
import EditToolbar from "@component/atom/EditToolbar";
import Task from "@model/Task";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  CircularProgress,
  Container,
  LinearProgress,
  Stack,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { translate } from "@util/translate";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
}));

interface HomePageProps {}
const HomePage: React.FC<HomePageProps> = () => {
  const taskManager = useContext(TaskManagerContext);
  const taskManagerDispatch = useContext(TaskManagerDispatchContext);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    async function initialize() {
      taskManagerDispatch(fetchData);
      await taskManager.initializeTask();
      taskManagerDispatch({
        type: TaskActionType.Load,
        tasks: taskManager.tasks,
      });
      taskManagerDispatch(endData);
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = { type: TaskActionType.Fetch };
  const endData = { type: TaskActionType.End };

  const diffDate = useCallback((task: Task) => {
    return task.duration.dayDiff;
  }, []);

  // async function handleDone(id: string) {
  //   await taskManager.done(id);
  //   taskManagerDispatch({
  //     type: TaskActionType.Save,
  //     manager: taskManager,
  //   });
  // }

  // async function handleWait(id: string) {
  //   await taskManager.wait(id);
  //   taskManagerDispatch({
  //     type: TaskActionType.Save,
  //     manager: taskManager,
  //   });
  // }

  async function handleDelete(id: string) {
    await taskManager.deleteTask(id);
    taskManagerDispatch({
      type: TaskActionType.Save,
      manager: taskManager,
    });
  }

  const sortedList = useMemo(() => {
    return taskManager.sortList("createdAt");
  }, [taskManager]);

  const colorChange = useMemo(() => {
    if (taskManager.percentage >= 80) {
      return "success";
    } else if (taskManager.percentage < 80 && taskManager.percentage >= 50) {
      return "info";
    } else if (taskManager.percentage < 50 && taskManager.percentage >= 20) {
      return "warning";
    } else if (taskManager.percentage < 20 && taskManager.percentage >= 0) {
      return "error";
    }
  }, [taskManager]);

  const keys = useMemo<GridColDef<Task>[]>(() => {
    const newData = taskManager.tasks[0]
      ? Object.keys(taskManager.tasks[0])
          .filter((name) => name !== "edit" && name !== "id")
          .map((name, index) => ({
            field: name,
            headerName: translate(name),
            type: name.match(/(time|at)$/gi)
              ? "dateTime"
              : name.match(/done|edit/)
              ? "boolean"
              : "string",
            editable: true,
            flex: name === "name" ? 1 : undefined,
            valueFormatter: (params: any) => {
              return name.match(/startTime|endTime|createdAt/gi)
                ? params
                  ? dayjs(params).format("YYYY. MM. DD HH:mm")
                  : "-"
                : undefined;
            },
          }))
      : [];

    const list: GridColDef<Task>[] = [
      {
        field: "no",
        headerName: translate("id"),
        type: "true",
        editable: true,
      },
      ...newData,
    ] as GridColDef<Task>[];

    return taskManager.tasks[0] ? list : [];
  }, [taskManager.tasks]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    await taskManager.deleteTask(id as string);
    taskManagerDispatch({ type: TaskActionType.Save, manager: taskManager });
  };

  const handleCancelClick = (id: GridRowId) => async () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = taskManager.tasks.find((row) => row.id === id);
    if (editedRow!.edit) {
      await handleDelete(id as string);
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, edit: false } as Task;
    taskManager.updateTask(updatedRow);
    taskManagerDispatch({ type: TaskActionType.Save, manager: taskManager });
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  return (
    <Stack>
      <Container maxWidth='md'>
        <Toolbar />
        <Typography
          fontSize={FS_LARGE}
          fontWeight={700}
          align='center'
          gutterBottom>
          나의 할 일
        </Typography>
        <Stack gap={3}>
          <Stack sx={{ position: "relative" }}>
            <BorderLinearProgress
              variant='determinate'
              color={colorChange}
              value={taskManager.percentage}
            />
            <Typography
              fontWeight={700}
              sx={{
                color: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
              {taskManager.percentage}%
            </Typography>
          </Stack>
          {taskManager.state === "Fetch" && (
            <Stack alignItems='center' justifyContent='center' minHeight={200}>
              <CircularProgress size={40} />
            </Stack>
          )}
          {taskManager.state === "End" && (
            <DataGrid
              onRowSelectionModelChange={(rows) => {}}
              checkboxSelection
              columns={
                [
                  ...keys,
                  {
                    field: "actions",
                    type: "actions",
                    headerName: "Actions",
                    width: 100,
                    cellClassName: "actions",
                    getActions: ({ id }) => {
                      const isInEditMode =
                        rowModesModel[id]?.mode === GridRowModes.Edit;

                      if (isInEditMode) {
                        return [
                          <GridActionsCellItem
                            icon={<SaveIcon />}
                            label='Save'
                            sx={{
                              color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                          />,
                          <GridActionsCellItem
                            icon={<CancelIcon />}
                            label='Cancel'
                            className='textPrimary'
                            onClick={handleCancelClick(id)}
                            color='inherit'
                          />,
                        ];
                      }

                      return [
                        <GridActionsCellItem
                          icon={<EditIcon />}
                          label='Edit'
                          className='textPrimary'
                          onClick={handleEditClick(id)}
                          color='inherit'
                        />,
                        <GridActionsCellItem
                          icon={<DeleteIcon />}
                          label='Delete'
                          onClick={handleDeleteClick(id)}
                          color='inherit'
                        />,
                      ];
                    },
                  },
                ] as GridColDef<GridValidRowModel>[]
              }
              rows={sortedList}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              rowModesModel={rowModesModel}
              onRowEditStart={handleRowEditStop}
              onRowModesModelChange={handleRowModesModelChange}
              processRowUpdate={processRowUpdate}
              slots={{ toolbar: EditToolbar }}
              slotProps={{
                toolbar: { setRowModesModel },
              }}
            />
          )}
        </Stack>
      </Container>
    </Stack>
  );
};

export default HomePage;
