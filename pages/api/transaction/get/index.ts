import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const getTransactions = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await prisma.transaction.findMany({
      include: { source: true },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while getting transactions.",
    });
  }
};

export default getTransactions;
