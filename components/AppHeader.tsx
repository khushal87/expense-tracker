import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { CardActions } from "@mui/material";
import { signOut } from "next-auth/react";

type AppHeaderType = {
  onMonthChangeHandler: (month: number, year: number) => Promise<void>;
};

export const AppHeader = ({ onMonthChangeHandler }: AppHeaderType) => {
  const [isMonthModalVisible, setIsMonthModalVisible] =
    useState<boolean>(false);
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());

  return (
    <AppBar component={"nav"}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Personal Budget
        </Typography>
        <Button color="inherit" onClick={() => setIsMonthModalVisible(true)}>
          {month + "/" + year}
        </Button>
        <Button
          color="inherit"
          onClick={() =>
            signOut({
              callbackUrl: `${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/auth/signin`,
            })
          }
        >
          Logout
        </Button>
      </Toolbar>
      <Modal
        open={isMonthModalVisible}
        onClose={() => setIsMonthModalVisible(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: 400,
          }}
        >
          <CardHeader
            title={"Choose Month and Year"}
            action={
              <IconButton onClick={() => setIsMonthModalVisible(false)}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["month", "year"]}
                disableFuture
                defaultValue={dayjs(`${year}-${month}`).startOf("month")}
                onChange={(value) => {
                  if (value) {
                    setMonth(value?.month() + 1);
                    setYear(value?.year());
                  }
                }}
              />
            </LocalizationProvider>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                onMonthChangeHandler(month, year);
                setIsMonthModalVisible(false);
              }}
            >
              Confirm
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </AppBar>
  );
};
