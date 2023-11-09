import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const getTransactionsByType = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { slug } = req.query;
    const month = slug?.[0];
    const year = slug?.[1];
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
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while getting transactions.",
    });
  }
};

export default getTransactionsByType;
