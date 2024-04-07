const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createSource = async () => {
  try {
    const result = await prisma.source.create({
      data: {
        name: "Test name",
        type: "Test type",
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

const createTransaction = async () => {
  try {
    const result = await prisma.transaction.create({
      data: {
        sourceId: "6611838350535ca5fd0c6ce7",
        amount: 1000,
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
