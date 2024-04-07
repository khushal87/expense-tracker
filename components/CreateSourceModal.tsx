import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { TransactionType } from "@/types";
import { Source, User } from "@prisma/client";
import axios from "axios";

type CreateSourceModalType = {
  addSource: (source: Source) => void;
  source: TransactionType;
  isCreateSourceModalVisible: boolean;
  setIsCreateSourceModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User;
};

export const CreateSourceModal = ({
  addSource,
  source,
  isCreateSourceModalVisible,
  setIsCreateSourceModalVisible,
  user,
}: CreateSourceModalType) => {
  const [isSourceCreated, setIsSourceCreated] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const cardHeaderTitle =
    source === TransactionType.income
      ? "Create Payor"
      : source === TransactionType.expense
      ? "Create Payee"
      : source === TransactionType.receivable
      ? "Create Receivable Source"
      : "Create Investment Source";
  const cardHeaderSubHeader =
    source === TransactionType.income
      ? "Create the source from whom you will receive the payment."
      : source === TransactionType.expense
      ? "Create the source to whom you have spent your money."
      : source === TransactionType.receivable
      ? "Create the source you have owed the money"
      : "Create the source to whom you have invested your money.";

  const createSource = async () => {
    try {
      if (!user) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/source/create`,
        {
          name,
          type: source,
          userId: user.id,
        }
      );
      if (response.status === 200) {
        setIsCreateSourceModalVisible(false);
        setIsSourceCreated(true);
        setName("");
        addSource(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={isCreateSourceModalVisible}
        onClose={() => setIsCreateSourceModalVisible(false)}
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
            title={cardHeaderTitle}
            subheader={cardHeaderSubHeader}
            subheaderTypographyProps={{ style: { fontSize: 14 } }}
            action={
              <IconButton onClick={() => setIsCreateSourceModalVisible(false)}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <TextField
              required
              id={`${source.toLowerCase()}-source-name`}
              label="Name"
              size="medium"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button onClick={createSource}>Create {source} source</Button>
          </CardActions>
        </Card>
      </Modal>
      <Snackbar
        open={isSourceCreated}
        autoHideDuration={3000}
        onClose={() => setIsSourceCreated(false)}
      >
        <Alert severity="success">{`${source} source created successfully!`}</Alert>
      </Snackbar>
    </>
  );
};
