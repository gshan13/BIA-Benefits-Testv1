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

      // Retrieve the logged-in user
      const loggedInUser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          business: {
            include: {
              employees: {
                include: {
                  users: true,
                },
              },
            },
          },
        },
      });

      // Extract employees associated with the logged-in business
      const employees = loggedInUser.business.employees;

      res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
