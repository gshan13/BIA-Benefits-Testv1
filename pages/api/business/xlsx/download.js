import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";
import { getSession } from "next-auth/react";
import { Prisma } from "@/utils/db";

const prisma = new PrismaClient();

export default async (req, res) => {
  try {
    // Fetch data from the database
    const session = await getSession({ req });

    // Check if the user is authenticated
    if (!session) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Retrieve the logged-in user
    const loggedInUser = await prisma.user.findUnique({
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
    });

    // Extract businesses associated with the logged-in BIA
    const businesses = loggedInUser.bia.businesses;

    // Convert data to XLSX format
    const worksheet = XLSX.utils.json_to_sheet(businesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Create a Blob object representing the data as an XLSX file
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Send the XLSX file as a response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=data_from_db.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
