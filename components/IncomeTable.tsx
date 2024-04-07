import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { CreateSourceModal } from "./CreateSourceModal";
import { AddTransactionModal } from "./AddTransactionModal";
import dayjs from "dayjs";
import { TransactionDataType, TransactionType } from "@/types";
import { CardContent, CardHeader, Paper } from "@mui/material";
import { Source, User } from "@prisma/client";

type IncomeTableType = {
  addSource: (source: Source) => void;
  incomes: TransactionDataType[];
  setIncomes: React.Dispatch<React.SetStateAction<TransactionDataType[]>>;
  sources: Source[];
  user?: User;
};

export const IncomeTable = ({
  addSource,
  incomes,
  setIncomes,
  sources,
  user,
}: IncomeTableType) => {
  const [isCreatePayerModalVisible, setIsCreatePayerModalVisible] =
    useState<boolean>(false);
  const [isAddIncomeModalVisible, setIsAddIncomeModalVisible] =
    useState<boolean>(false);

  const addIncome = (data: TransactionDataType) => {
    setIncomes((prevIncomes) => [...prevIncomes, data]);
  };

  return (
    <Card>
      <CardHeader
        title={TransactionType.income}
        subheader={`Total - ${incomes.reduce(
          (acc, income) => acc + income.amount,
          0
        )}`}
        subheaderTypographyProps={{
          style: {
            fontWeight: "bold",
          },
        }}
      />
      <CardContent style={{ padding: 0 }}>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 320, overflowY: "scroll" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount(₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes
                .filter((income) => income.createdAt)
                .map((income) => {
                  return (
                    <TableRow key={income.id}>
                      <TableCell>{income.source.name}</TableCell>
                      <TableCell>
                        {dayjs(income.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="right">{income.amount}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions>
        <Button onClick={() => setIsCreatePayerModalVisible(true)}>
          Create Payer
        </Button>
        <Button onClick={() => setIsAddIncomeModalVisible(true)}>
          Add Income
        </Button>
      </CardActions>
      <CreateSourceModal
        addSource={addSource}
        source={TransactionType.income}
        isCreateSourceModalVisible={isCreatePayerModalVisible}
        setIsCreateSourceModalVisible={setIsCreatePayerModalVisible}
        user={user}
      />
      <AddTransactionModal
        source={TransactionType.income}
        addTransaction={addIncome}
        isAddSourceModalVisible={isAddIncomeModalVisible}
        setIsAddSourceModalVisible={setIsAddIncomeModalVisible}
        sources={sources.filter(
          (source) => source.type === TransactionType.income
        )}
        user={user}
      />
    </Card>
  );
};
