import "@assets/index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AppRoot from "@router/AppRoot.tsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import TaskManagerProvider from "./provider/TaskManagerProvider";
import { koKR } from "@mui/x-date-pickers/locales";
import { createTheme, ThemeProvider } from "@mui/material";
import { koKR as dataGridKoKR } from "@mui/x-data-grid/locales";
import { koKR as coreKoKR } from "@mui/material/locale";
import "dayjs/locale/ko";

const theme = createTheme(
  {
    // palette: {
    //   primary: { main: "#1976d2" },
    // },
  },
  koKR, // x-date-pickers translations
  dataGridKoKR,
  coreKoKR // core translations
);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <RecoilRoot>
      {/* <StrictMode> */}
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ko'>
          <TaskManagerProvider>
            <AppRoot />
          </TaskManagerProvider>
        </LocalizationProvider>
      </BrowserRouter>
      {/* </StrictMode> */}
    </RecoilRoot>
  </ThemeProvider>
);
