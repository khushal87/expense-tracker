import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
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
import { TransactionType } from "@/pages";
import dayjs from "dayjs";

type ExpenseTableType = {
    expenses: TransactionType[];
    setExpenses: React.Dispatch<React.SetStateAction<TransactionType[]>>;
};

export const ExpenseTable = ({ expenses, setExpenses }: ExpenseTableType) => {
    const [isCreatePayeeModalVisible, setIsCreatePayeeModalVisible] =
        useState<boolean>(false);
    const [isAddExpenseModalVisible, setIsAddExpenseModalVisible] =
        useState<boolean>(false);

    const addExpense = (data: TransactionType) => {
        setExpenses((prevExpenses) => [...prevExpenses, data]);
    };

    return (
        <TableContainer component={Card}>
            <Table aria-label="simple table">
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
                                    {dayjs(expense.createdAt).format(
                                        "DD-MM-YYYY"
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {expense.amount}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <CardActions>
                <Button onClick={() => setIsCreatePayeeModalVisible(true)}>
                    Create Payee
                </Button>
                <Button onClick={() => setIsAddExpenseModalVisible(true)}>
                    Add Expense
                </Button>
            </CardActions>
            <CreateSourceModal
                source="Expense"
                isCreateSourceModalVisible={isCreatePayeeModalVisible}
                setIsCreateSourceModalVisible={setIsCreatePayeeModalVisible}
            />
            <AddTransactionModal
                source="Expense"
                addTransaction={addExpense}
                isAddSourceModalVisible={isAddExpenseModalVisible}
                setIsAddSourceModalVisible={setIsAddExpenseModalVisible}
            />
        </TableContainer>
    );
};
