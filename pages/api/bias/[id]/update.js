import { prisma } from "@/utils/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;

    const session = await getServerSession(req, res, authOptions);
    console.log("Session", session);

    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    try {
      const { body } = req;

      const existingBia = await prisma.BIA.findUnique({
        where: {
          id: id, // Ensure id is of the correct format (string or number)
        },
        include: {
          addresses: true, // Include addresses for update
        },
      });

      if (!existingBia) {
        return res.status(404).json({ error: "BIA not found" });
      }

      // Update the BIA data based on the incoming body
      const updatedAddresses = body.addresses.map((address) => ({
        where: { id: address.id },
        data: {
          postalCode: address.postalCode,
          province: address.province,
          city: address.city,
          street1: address.street1,
          street2: address.street2,
          // ... include other fields you want to update for addresses
        },
      }));

      // Update the users associated with the BIA
      const updatedUsers = body.users.map((user) => ({
        where: { id: user.id },
        data: {
          name: body.personOfContact,
          email: body.emailOfContact,
        },
      }));

      const updatedBia = await prisma.BIA.update({
        where: {
          id: id,
        },
        data: {
          nameOfBia: body.nameOfBia,
          personOfContact: body.personOfContact,
          emailOfContact: body.emailOfContact,
          phBia: body.phBia,
          phPersonOfContact: body.phPersonOfContact,
          active: body.active,
          biaId: body.biaId,
          // Update the addresses field using the correct format
          addresses: {
            update: updatedAddresses,
          },
          // Update the users field using the correct format
          users: {
            update: updatedUsers,
          },
        },
      });

      return res.status(200).json(updatedBia);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update BIA" });
    } finally {
      await prisma.$disconnect(); // Disconnect from the database after the operation
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
