import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const createTransaction = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = req.body;
    try {
        const result = await prisma.transaction.create({
            data: {
                ...JSON.parse(data),
            },
            include: {
                source: true,
            },
        });
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(403).json({
            err: "Error occured while adding a new transaction.",
        });
    }
};

export default createTransaction;
