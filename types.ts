import { Source, Transaction } from "@prisma/client";

export enum TransactionType {
    income = "Income",
    expense = "Expense",
    investment = "Investment",
}

export type TransactionDataType = Transaction & {
    source: Source;
};
