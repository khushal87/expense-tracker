import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { IncomeTable } from "@/components/IncomeTable";
import { ExpenseTable } from "@/components/ExpenseTable";
import { InvestmentTable } from "@/components/InvestmentTable";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { AppHeader } from "@/components/AppHeader";
import { TransactionDataType, TransactionType } from "@/types";
import { getTransactionsForUserId } from "@/utils/getTransactions";
import { PrismaClient, Source, User } from "@prisma/client";
import axios from "axios";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { ReceivableTable } from "@/components/ReceivableTable";
import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

type PageProps = {
  sources: Source[];
  transactions: TransactionDataType[];
  user?: User;
};

export default function Home(props: PageProps) {
  const { status } = useSession();
  const [sources, setSources] = useState<Source[]>(props.sources);

  const addSource = (source: Source) => {
    setSources((prevSources) => [...prevSources, source]);
  };

  const [incomes, setIncomes] = useState<TransactionDataType[]>(
    props.transactions.filter(
      (transaction) => transaction.source.type === TransactionType.income
    )
  );
  const [expenses, setExpenses] = useState<TransactionDataType[]>(
    props.transactions.filter(
      (transaction) => transaction.source.type === TransactionType.expense
    )
  );
  const [investments, setInvestments] = useState<TransactionDataType[]>(
    props.transactions.filter(
      (transaction) => transaction.source.type === TransactionType.investment
    )
  );
  const [receivables, setReceivables] = useState<TransactionDataType[]>(
    props.transactions.filter(
      (transaction) => transaction.source.type === TransactionType.receivable
    )
  );

  const onMonthChangeHandler = async (month: number, year: number) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/get/${month}/${year}/${props.user?.id}`
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
    setReceivables(
      data.filter(
        (transaction: TransactionDataType) =>
          transaction.source.type === TransactionType.receivable
      )
    );
  };

  if (status === "loading") return <h1>Loading...</h1>;

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home Page for the Expense Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Container>
          <AppHeader onMonthChangeHandler={onMonthChangeHandler} />
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
                  <CalendarMonthIcon style={{ marginRight: 10 }} />
                  {dayjs(new Date()).format("DD-MM-YYYY")}
                </Typography>
                <ExpensePieChart
                  totalIncome={incomes.reduce(
                    (acc, income) => acc + income.amount,
                    0
                  )}
                  totalExpense={expenses.reduce(
                    (acc, expense) => acc + expense.amount,
                    0
                  )}
                  totalInvestments={investments.reduce(
                    (acc, investment) => acc + investment.amount,
                    0
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} py={5}>
              <Grid item xs={12} lg={4} md={6}>
                <IncomeTable
                  addSource={addSource}
                  incomes={incomes}
                  setIncomes={setIncomes}
                  sources={sources}
                  user={props.user}
                />
              </Grid>
              <Grid item xs={12} lg={4} md={6}>
                <ExpenseTable
                  addSource={addSource}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  sources={sources}
                  user={props.user}
                />
              </Grid>
              <Grid item xs={12} lg={4} md={6}>
                <InvestmentTable
                  addSource={addSource}
                  investments={investments}
                  setInvestments={setInvestments}
                  sources={sources}
                  user={props.user}
                />
              </Grid>
              <Grid item xs={12} lg={4} md={6}>
                <ReceivableTable
                  addSource={addSource}
                  receivables={receivables}
                  setReceivables={setReceivables}
                  sources={sources}
                  user={props.user}
                />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const currentDate = new Date();
  const prisma = new PrismaClient();

  const userResponse = await prisma.user.findFirst({
    where: { email: session.user?.email },
  });

  if (!userResponse) {
    return {
      props: {
        sources: [],
        transactions: [],
      },
    };
  }

  const sourceResponse = await prisma.source.findMany({
    where: { userId: userResponse?.id },
  });

  const transactionResponse = await getTransactionsForUserId(
    prisma,
    currentDate.getMonth() + 1,
    currentDate.getFullYear(),
    userResponse?.id
  );
  return {
    props: {
      sources: JSON.parse(JSON.stringify(sourceResponse)),
      transactions: JSON.parse(JSON.stringify(transactionResponse)),
      user: userResponse,
    },
  };
};
