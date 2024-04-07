import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const getSources = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;

    const result = await prisma.source.findMany({
      where: { userId: data.userId },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while getting sources.",
    });
  }
};

export default getSources;
