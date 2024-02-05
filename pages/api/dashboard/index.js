import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const biaCount = await prisma.bIA.count();
      const businessCount = await prisma.business.count();
      const employeeCount = await prisma.employees.count();
      const dealCount = await prisma.deal.count();

      res.status(200).json({
        biaCount,
        businessCount,
        employeeCount,
        dealCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
