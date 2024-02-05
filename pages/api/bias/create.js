import { prisma } from "@/utils/db";
import { serverValidation } from "@/validator/validator";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (req.method === "POST") {
    const { nameOfBia, personOfContact, emailOfContact, phBia, phPersonOfContact, active, addresses } = req.body;

    try {
      await serverValidation.validate(req.body, { abortEarly: false });

      // checks for existing BIA with the similar name or email
      // if found, returns validation error. Feature requested by client
      const existingBiaByName = await prisma.BIA.findFirst({
        where: {
          nameOfBia: nameOfBia.toLowerCase(),
        },
      });

      const existingBiaByEmail = await prisma.BIA.findFirst({
        where: {
          emailOfContact: emailOfContact.toLowerCase(),
        },
      });

      if (existingBiaByName || existingBiaByEmail) {
        return res.status(400).json({
          error: "BIA with this name or contact email already exist",
        });
      }

      // UniqueID generation limit for BIA
      const lowerLimit = 1000000000;
      const upperLimit = 2000000000;

      let nextBIAUniqueId;

      // Generate a random value between lowerLimit and upperLimit (inclusive)
      nextBIAUniqueId = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;

      // Check if the generated uniqueId already exists, and if so, generate another one
      while (
        await prisma.BIA.findFirst({
          where: {
            uniqueId: nextBIAUniqueId.toString(), // Convert to string
          },
        })
      ) {
        nextBIAUniqueId = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
      }

      const formattedAddresses = addresses.map((address) => ({
        postalCode: formatPostalCode(address.postalCode),
        province: address.province,
        city: address.city,
        street1: address.street1,
        street2: address.street2,
      }));

      const newBIA = await prisma.BIA.create({
        data: {
          uniqueId: nextBIAUniqueId.toString(),
          nameOfBia,
          personOfContact,
          emailOfContact: emailOfContact.toLowerCase(),
          phBia,
          phPersonOfContact,
          active,
          addresses: {
            create: formattedAddresses,
          },
          users: {
            create: {
              name: nameOfBia,
              role: "BIA",
              active: true,
              email: emailOfContact.toLowerCase(),
            },
          },
        },
        include: {
          users: true,
        },
      });

      res.status(200).json(newBIA);
    } catch (error) {
      console.error("Error:", error);
      // Handle validation errors
      if (error.name === "ValidationError") {
        const errors = error.errors.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        res.status(400).json({ errors });
      } else {
        // Handle other errors (e.g., database errors)
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// Function to format postal code by adding a space after the first 3 characters
function formatPostalCode(postalCode) {
  return postalCode.replace(/^([A-Z]\d[A-Z])/, "$1 ").toLowerCase();
}
