import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      const loggedInUser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      // Check if the logged-in user is a Super Admin
      if (loggedInUser.role === "SUPER_ADMIN") {
        // If the user is a Super Admin, fetch all businesses without considering the BIA relationship
        const businesses = await prisma.business.findMany({
          include: {
            addresses: true,
          },
        });

        res.status(200).json(businesses);
      } else {
        // For other roles, fetch businesses associated with the BIA
        const businesses = await prisma.user
          .findUnique({
            where: {
              email: session.user.email,
            },
            include: {
              bia: {
                include: {
                  businesses: {
                    include: {
                      addresses: true,
                    },
                  },
                },
              },
            },
          })
          .then((user) => user?.bia?.businesses || []);

        res.status(200).json(businesses);
      }
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
