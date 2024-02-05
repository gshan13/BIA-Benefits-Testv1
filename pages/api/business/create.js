import { businessServerValidation } from "@/validator/validator";
import { prisma } from "@/utils/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    try {
      await businessServerValidation.validate(req.body, { abortEarly: false });

      const { name, email, Phone, street1, street2, postalCode, userEmail, category, city, province, id } = req.body;

      const loggedInUser = await prisma.user.findUnique({
        where: {
          email: userEmail,
          role: {
            in: ["SUPER_ADMIN", "BIA"],
          },
        },
        include: {
          bia: {
            include: {
              addresses: true,
            },
          },
        },
      });

      console.log("Logged In User:", loggedInUser);

      const biaId = loggedInUser.bia?.id || id;

      console.log("Creating new business...");

      const lowerLimit = 3000000000;
      const upperLimit = 5000000000;

      let nextBusinessUniqueId;

      // Generate a random value between lowerLimit and upperLimit (inclusive)
      nextBusinessUniqueId = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;

      // Check if the generated uniqueId already exists, and if so, generate another one
      while (
        await prisma.business.findFirst({
          where: {
            uniqueId: nextBusinessUniqueId.toString(), // Convert to string
          },
        })
      ) {
        nextBusinessUniqueId = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
      }

      const uniqueId = nextBusinessUniqueId.toString();
      console.log("UniqueId:", uniqueId);
      const newBusiness = await prisma.business.create({
        data: {
          name,
          phone: Phone || null,
          biaId: biaId || biaID,
          category,
          postalCode: formatPostalCode(postalCode),
          street1,
          street2,
          uniqueId: uniqueId,
          addresses: {
            create: {
              postalCode,
              city: city || loggedInUser.bia.addresses?.[0]?.city,
              province: province || loggedInUser.bia.addresses?.[0]?.province,
              bia: {
                connect: { id: biaId || id },
              },
            },
          },
          users: {
            create: {
              name,
              role: "BUSINESS",
              active: true,
              email,
            },
          },
        },
        include: {
          users: true,
          addresses: true,
        },
      });

      console.log("New Business created:", newBusiness);

      // Set success message
      const successMessage = "New business created successfully!";

      // Redirect with success message
      res.status(200).json({ success: successMessage });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "email " });
    }
  } else {
    console.log("Method Not Allowed.");
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

function formatPostalCode(postalCode) {
  return postalCode.replace(/^([A-Z]\d[A-Z])/, "$1 ").toUpperCase();
}
