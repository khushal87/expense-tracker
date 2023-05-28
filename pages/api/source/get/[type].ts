import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const getSourcesByType = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { type } = req.query;
        const result = await prisma.source.findMany({
            where: { type: type as string },
        });
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(403).json({
            err: "Error occured while getting sources.",
        });
    }
};

export default getSourcesByType;
