import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const getTransactionsForUserId = async (
  prisma: PrismaClient,
  month: number,
  year: number,
  userId: string
) => {
  try {
    const startDate = dayjs(`${year}-${month}`).startOf("month").toISOString();
    const endDate = dayjs(`${year}-${month}`).endOf("month").toISOString();
    const result = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        userId,
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
