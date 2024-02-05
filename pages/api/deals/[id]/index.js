import { prisma } from "@/utils/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }

      // Fetch BIA details including related addresses, users, and businesses
      const deal = await prisma.Deal.findUnique({
        where: {
          id: String(id),
        },
        include: {
          addresses: true,
        },
      });

      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      return res.status(200).json(deal);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Failed to fetch Business" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
