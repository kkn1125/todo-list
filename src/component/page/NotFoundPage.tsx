import { FS_LARGE, FS_MEDIUM } from "@common/size";
import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface NotFoundPageProps {}
const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <Stack>
      <Typography fontSize={FS_LARGE}>404</Typography>
      <Typography fontSize={FS_MEDIUM}>Not Found</Typography>
      <Button component={Link} to='/'>
        메인으로
      </Button>
    </Stack>
  );
};

export default NotFoundPage;
