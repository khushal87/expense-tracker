import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const getTransactions = async (
  prisma: PrismaClient,
  month: number,
  year: number
) => {
  try {
    const endDate = dayjs(`${year}-${month}`).endOf("month").toISOString();
    const startDate = dayjs(`${year}-${month}`).startOf("month").toISOString();
    const result = await prisma.transaction.findMany({
      where: {
        createdAt: {
          lte: endDate,
          gte: startDate,
        },
      },
      include: {
        source: true,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};
