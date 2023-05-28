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
import { TransactionType } from "@/pages";
import dayjs from "dayjs";

type IncomeTableType = {
    incomes: TransactionType[];
    setIncomes: React.Dispatch<React.SetStateAction<TransactionType[]>>;
};

export const IncomeTable = ({ incomes, setIncomes }: IncomeTableType) => {
    const [isCreatePayorModalVisible, setIsCreatePayorModalVisible] =
        useState<boolean>(false);
    const [isAddIncomeModalVisible, setIsAddIncomeModalVisible] =
        useState<boolean>(false);

    const addIncome = (data: TransactionType) => {
        setIncomes((prevIncomes) => [...prevIncomes, data]);
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
                    {incomes.map((income) => {
                        return (
                            <TableRow key={income.id}>
                                <TableCell>{income.source.name}</TableCell>
                                <TableCell>
                                    {dayjs(income.createdAt).format(
                                        "DD-MM-YYYY"
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {income.amount}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <CardActions>
                <Button onClick={() => setIsCreatePayorModalVisible(true)}>
                    Create Payor
                </Button>
                <Button onClick={() => setIsAddIncomeModalVisible(true)}>
                    Add Income
                </Button>
            </CardActions>
            <CreateSourceModal
                source="Income"
                isCreateSourceModalVisible={isCreatePayorModalVisible}
                setIsCreateSourceModalVisible={setIsCreatePayorModalVisible}
            />
            <AddTransactionModal
                source="Income"
                addTransaction={addIncome}
                isAddSourceModalVisible={isAddIncomeModalVisible}
                setIsAddSourceModalVisible={setIsAddIncomeModalVisible}
            />
        </TableContainer>
    );
};
