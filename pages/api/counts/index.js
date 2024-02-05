import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const employeesCount = await prisma.Employees.count();
    const dealsCount = await prisma.Deal.count();
    const businessesCount = await prisma.Business.count();
    const biaCount = await prisma.BIA.count();


    res.status(200).json({
      employees: employeesCount,
      deals: dealsCount,
      businesses: businessesCount,
      bias: biaCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
