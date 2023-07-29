import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {IncomeTable} from "@/components/IncomeTable";
import {ExpenseTable} from "@/components/ExpenseTable";
import {InvestmentTable} from "@/components/InvestmentTable";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {AppHeader} from "@/components/AppHeader";
import {TransactionDataType, TransactionType} from "@/types";
import {getTransactions} from "@/utils/getTransactions";
import {PrismaClient} from "@prisma/client";
import axios from "axios";
import {ExpensePieChart} from "@/components/ExpensePieChart";

export default function Home(props: { transactions: TransactionDataType[] }) {
    const [incomes, setIncomes] = useState<TransactionDataType[]>(
        props.transactions.filter(
            (transaction) => transaction.source.type === "Income"
        )
    );
    const [expenses, setExpenses] = useState<TransactionDataType[]>(
        props.transactions.filter(
            (transaction) => transaction.source.type === "Expense"
        )
    );
    const [investments, setInvestments] = useState<TransactionDataType[]>(
        props.transactions.filter(
            (transaction) => transaction.source.type === "Investment"
        )
    );

    const onMonthChangeHandler = async (month: number, year: number) => {
        const response = await axios.get(
            `${process.env.API_URL}/api/transaction/get/${month}/${year}`
        );
        const data = response.data;
        setIncomes(
            data.filter(
                (transaction: TransactionDataType) =>
                    transaction.source.type === TransactionType.income
            )
        );
        setExpenses(
            data.filter(
                (transaction: TransactionDataType) =>
                    transaction.source.type === TransactionType.expense
            )
        );
        setInvestments(
            data.filter(
                (transaction: TransactionDataType) =>
                    transaction.source.type === TransactionType.investment
            )
        );
    };

    return (
        <>
            <Head>
                <title>Home</title>
                <meta name="description" content="Home Page for the Expense Tracker"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`${styles.main}`}>
                <Container>
                    <AppHeader onMonthChangeHandler={onMonthChangeHandler}/>
                    <Grid container py={10}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={8} md={6}>
                                <Typography variant="h3" fontWeight="700">
                                    Expense Tracker
                                </Typography>
                                <Typography color={"gray"} variant="h6">
                                    This app is built for you to manage your income and expenses
                                    with ease.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} lg={4} md={6}>
                                <Typography
                                    variant="h5"
                                    fontWeight="500"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <CalendarMonthIcon style={{marginRight: 10}}/>
                                    {dayjs(new Date()).format("DD-MM-YYYY")}

                                </Typography>
                                <ExpensePieChart
                                    totalIncome={incomes.reduce((acc, income) => acc + income.amount, 0)}
                                    totalExpense={expenses.reduce((acc, expense) => acc + expense.amount, 0)}
                                    totalInvestments={investments.reduce((acc, investment) => acc + investment.amount, 0)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} py={5}>
                            <Grid item xs={12} lg={4} md={6}>
                                <IncomeTable incomes={incomes} setIncomes={setIncomes}/>
                            </Grid>
                            <Grid item xs={12} lg={4} md={6}>
                                <ExpenseTable expenses={expenses} setExpenses={setExpenses}/>
                            </Grid>
                            <Grid item xs={12} lg={4} md={6}>
                                <InvestmentTable
                                    investments={investments}
                                    setInvestments={setInvestments}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    const currentDate = new Date();
    const prisma = new PrismaClient();

    const response = await getTransactions(
        prisma,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );
    return {
        props: {
            transactions: JSON.parse(JSON.stringify(response)),
        },
    };
}
