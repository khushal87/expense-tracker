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

type InvestmentTableType = {
    investments: TransactionType[];
    setInvestments: React.Dispatch<React.SetStateAction<TransactionType[]>>;
};

export const InvestmentTable = ({
    investments,
    setInvestments,
}: InvestmentTableType) => {
    const [
        isCreateInvestmentSourceModalVisible,
        setIsCreateInvestmentSourceModalVisible,
    ] = useState<boolean>(false);
    const [isAddInvestmentModalVisible, setIsAddInvestmentModalVisible] =
        useState<boolean>(false);

    const addInvestment = (data: TransactionType) => {
        setInvestments((prevInvestments) => [...prevInvestments, data]);
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
                    {investments.map((investment) => {
                        return (
                            <TableRow key={investment.id}>
                                <TableCell>{investment.source.name}</TableCell>
                                <TableCell>
                                    {dayjs(investment.createdAt).format(
                                        "DD-MM-YYYY"
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {investment.amount}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <CardActions>
                <Button
                    onClick={() =>
                        setIsCreateInvestmentSourceModalVisible(true)
                    }
                >
                    Create Source
                </Button>
                <Button onClick={() => setIsAddInvestmentModalVisible(true)}>
                    Add Investment
                </Button>
            </CardActions>
            <CreateSourceModal
                source="Investment"
                isCreateSourceModalVisible={
                    isCreateInvestmentSourceModalVisible
                }
                setIsCreateSourceModalVisible={
                    setIsCreateInvestmentSourceModalVisible
                }
            />
            <AddTransactionModal
                source="Investment"
                addTransaction={addInvestment}
                isAddSourceModalVisible={isAddInvestmentModalVisible}
                setIsAddSourceModalVisible={setIsAddInvestmentModalVisible}
            />
        </TableContainer>
    );
};
