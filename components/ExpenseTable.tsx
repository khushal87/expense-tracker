import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import { CreateSourceModal } from "./CreateSourceModal";
import { AddTransactionModal } from "./AddTransactionModal";
import { TransactionDataType, TransactionType } from "@/types";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, Paper } from "@mui/material";
import { Source, User } from "@prisma/client";

type ExpenseTableType = {
  addSource: (source: Source) => void;
  expenses: TransactionDataType[];
  setExpenses: React.Dispatch<React.SetStateAction<TransactionDataType[]>>;
  sources: Source[];
  user?: User;
};

export const ExpenseTable = ({
  addSource,
  expenses,
  setExpenses,
  sources,
  user,
}: ExpenseTableType) => {
  const [isCreatePayeeModalVisible, setIsCreatePayeeModalVisible] =
    useState<boolean>(false);
  const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
    useState<boolean>(false);

  const addExpense = (data: TransactionDataType) => {
    setExpenses((prevExpenses) => [...prevExpenses, data]);
  };

  return (
    <Card>
      <CardHeader
        title={TransactionType.expense}
        subheader={`Total - ${expenses.reduce(
          (acc, expenses) => acc + expenses.amount,
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
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount(₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => {
                return (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.source.name}</TableCell>
                    <TableCell>
                      {dayjs(expense.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align="right">{expense.amount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <CardActions>
        <Button onClick={() => setIsCreatePayeeModalVisible(true)}>
          Create Payee
        </Button>
        <Button onClick={() => setIsAddExpenseModalVisible(true)}>
          Add Expense
        </Button>
      </CardActions>
      <CreateSourceModal
        addSource={addSource}
        source={TransactionType.expense}
        isCreateSourceModalVisible={isCreatePayeeModalVisible}
        setIsCreateSourceModalVisible={setIsCreatePayeeModalVisible}
        user={user}
      />
      <AddTransactionModal
        source={TransactionType.expense}
        addTransaction={addExpense}
        isAddSourceModalVisible={isAddExpenseModalVisible}
        setIsAddSourceModalVisible={setIsAddExpenseModalVisible}
        sources={sources.filter(
          (source) => source.type === TransactionType.expense
        )}
        user={user}
      />
    </Card>
  );
};
