import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

type ExpensePieChartType = {
  totalIncome: number;
  totalExpense: number;
  totalInvestments: number;
};

export const options = {
  title: "Expense Tracker",
};

export function ExpensePieChart({
  totalExpense,
  totalIncome,
  totalInvestments,
}: ExpensePieChartType) {
  const data = useMemo(() => {
    return [
      ["Source", "Amount"],
      ["Income", totalIncome],
      ["Expenses", totalExpense],
      ["Investments", totalInvestments],
    ];
  }, [totalInvestments, totalExpense, totalIncome]);

  return (
    <Chart chartType="PieChart" data={data} options={options} width={"100%"} />
  );
}
