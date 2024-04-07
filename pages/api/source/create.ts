import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const createSource = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;
  try {
    const result = await prisma.source.create({
      data,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      err: "Error occured while adding a new source.",
    });
  }
};

export default createSource;
