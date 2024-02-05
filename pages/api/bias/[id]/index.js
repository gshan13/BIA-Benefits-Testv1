import { prisma } from "@/utils/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).send("Unauthorized");
        return;
      }

      const { id } = req.query;

      // Fetch BIA details including related addresses, users, and businesses
      const bia = await prisma.BIA.findUnique({
        where: {
          id: String(id),
        },
        include: {
          addresses: true,
          users: true,
          businesses: {
            select: {
              id: true,
              name: true,
              addresses: true,
              uniqueId: true,
              category: true,
            },
          },
        },
      });

      if (!bia) {
        return res.status(404).json({ message: "BIA not found" });
      }

      return res.status(200).json(bia);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Failed to fetch BIA" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
