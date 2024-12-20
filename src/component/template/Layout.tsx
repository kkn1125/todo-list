import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

interface LayoutProps {}
const Layout: React.FC<LayoutProps> = () => {
  return (
    <Stack>
      <Outlet />
    </Stack>
  );
};

export default Layout;
