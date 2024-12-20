import { PATH } from "@common/variable";
import HomePage from "@component/page/HomePage";
import NotFoundPage from "@component/page/NotFoundPage";
import Layout from "@component/template/Layout";
import { Route, Routes } from "react-router-dom";

interface AppRootProps {}
const AppRoot: React.FC<AppRootProps> = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={PATH} element={<HomePage />} />
        <Route path={`${PATH}*`} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoot;
